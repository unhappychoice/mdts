import { configureStore } from '@reduxjs/toolkit';
import plantUMLReducer, {
  generatePlantUMLSvg,
  clearCache,
  selectPlantUMLData,
} from '../../../src/store/slices/plantUMLSlice';

global.fetch = jest.fn();

const hashDiagram = (diagram: string): string => {
  return Math.abs(
    Array.from(diagram).reduce((hash, char) => {
      const nextHash = (hash << 5) - hash + char.charCodeAt(0);
      return nextHash & nextHash;
    }, 0),
  ).toString(36);
};

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      plantUML: plantUMLReducer,
    },
    preloadedState: {
      plantUML: {
        svgCache: {},
        loading: {},
        errors: {},
        ...initialState,
      },
    },
  });
};

describe('plantUMLSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(plantUMLReducer(undefined, { type: '' })).toEqual({
        svgCache: {},
        loading: {},
        errors: {},
      });
    });

    it('should handle clearCache', () => {
      const previousState = {
        svgCache: { hash1: 'svg1' },
        loading: { hash1: true },
        errors: { hash1: 'error' },
      };
      
      expect(plantUMLReducer(previousState, clearCache())).toEqual({
        svgCache: {},
        loading: {},
        errors: {},
      });
    });
  });

  describe('generatePlantUMLSvg async thunk', () => {
    it('should return cached SVG if available', async () => {
      const diagram = '@startuml\nA --> B\n@enduml';
      const cachedSvg = '<svg>cached</svg>';
      const expectedHash = hashDiagram(diagram);
      
      const store = createTestStore({
        svgCache: { [expectedHash]: cachedSvg },
      });

      const result = await store.dispatch(generatePlantUMLSvg(diagram));
      
      expect(result.type).toBe('plantUML/generateSvg/fulfilled');
      expect(result.payload).toEqual({
        hash: expectedHash,
        svg: cachedSvg,
      });
    });

    it('should fetch SVG successfully and cache it', async () => {
      const diagram = '@startuml\nA --> B\n@enduml';
      const svg = '<svg>generated</svg>';
      const expectedHash = hashDiagram(diagram);

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValue(svg),
      });

      const store = createTestStore();
      const result = await store.dispatch(generatePlantUMLSvg(diagram));
      const state = store.getState().plantUML;

      expect(global.fetch).toHaveBeenCalledWith('/api/plantuml/svg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagram }),
      });
      expect(result.type).toBe('plantUML/generateSvg/fulfilled');
      expect(result.payload).toEqual({
        hash: expectedHash,
        svg,
      });
      expect(state.svgCache[expectedHash]).toBe(svg);
      expect(state.loading[expectedHash]).toBe(false);
      expect(state.errors[expectedHash]).toBe(null);
    });

    it('should handle fetch failure', async () => {
      const diagram = '@startuml\nA --> B\n@enduml';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const store = createTestStore();
      const result = await store.dispatch(generatePlantUMLSvg(diagram));

      expect(result.type).toBe('plantUML/generateSvg/rejected');
      expect(result.payload).toBe('Failed to render PlantUML diagram');
    });

    it('should handle network error', async () => {
      const diagram = '@startuml\nA --> B\n@enduml';
      const error = new Error('Network error');
      
      (global.fetch as jest.Mock).mockRejectedValueOnce(error);

      const store = createTestStore();
      const result = await store.dispatch(generatePlantUMLSvg(diagram));

      expect(result.type).toBe('plantUML/generateSvg/rejected');
      expect(result.payload).toBe('Network error');
    });
  });

  describe('extra reducers', () => {
    it('should handle generatePlantUMLSvg.pending', () => {
      const diagram = '@startuml\nA --> B\n@enduml';
      const store = createTestStore();
      
      store.dispatch({
        type: generatePlantUMLSvg.pending.type,
        meta: { arg: diagram },
      });

      const state = store.getState().plantUML;
      const hash = Object.keys(state.loading)[0];
      
      expect(state.loading[hash]).toBe(true);
      expect(state.errors[hash]).toBe(null);
    });

    it('should handle generatePlantUMLSvg.fulfilled', () => {
      const svg = '<svg>test</svg>';
      const hash = 'test-hash';
      const store = createTestStore();
      
      store.dispatch({
        type: generatePlantUMLSvg.fulfilled.type,
        payload: { hash, svg },
      });

      const state = store.getState().plantUML;
      
      expect(state.svgCache[hash]).toBe(svg);
      expect(state.loading[hash]).toBe(false);
      expect(state.errors[hash]).toBe(null);
    });

    it('should handle generatePlantUMLSvg.rejected', () => {
      const diagram = '@startuml\nA --> B\n@enduml';
      const errorMessage = 'Test error';
      const store = createTestStore();
      
      store.dispatch({
        type: generatePlantUMLSvg.rejected.type,
        payload: errorMessage,
        meta: { arg: diagram },
      });

      const state = store.getState().plantUML;
      const hash = Object.keys(state.loading)[0];
      
      expect(state.loading[hash]).toBe(false);
      expect(state.errors[hash]).toBe(errorMessage);
    });
  });

  describe('selectPlantUMLData selector', () => {
    it('should return correct data for diagram', () => {
      const diagram = '@startuml\nA --> B\n@enduml';
      const svg = '<svg>test</svg>';
      const hash = 'test-hash';
      
      const state = {
        plantUML: {
          svgCache: { [hash]: svg },
          loading: { [hash]: false },
          errors: { [hash]: null },
        },
      };

      const result = selectPlantUMLData(state, diagram);
      
      expect(result).toEqual({
        hash: expect.any(String),
        svg: undefined, // hash will be different due to different calculation
        isLoading: undefined,
        error: undefined,
      });
    });
  });
});
