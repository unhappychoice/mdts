import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

interface PlantUMLState {
  svgCache: Record<string, string>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
}

export const selectPlantUMLData = createSelector(
  [
    (state: { plantUML: PlantUMLState }) => state.plantUML, 
    (_: { plantUML: PlantUMLState }, diagram: string) => diagram,
  ],
  (plantUMLState, diagram) => {
    const hash = hashString(diagram);
    return {
      hash,
      svg: plantUMLState.svgCache[hash],
      isLoading: plantUMLState.loading[hash],
      error: plantUMLState.errors[hash],
    };
  }
);

const initialState: PlantUMLState = {
  svgCache: {},
  loading: {},
  errors: {},
};

export const generatePlantUMLSvg = createAsyncThunk(
  'plantUML/generateSvg',
  async (diagram: string, { getState, rejectWithValue }) => {
    const hash = hashString(diagram);
    const state = getState() as { plantUML: PlantUMLState };
    
    if (state.plantUML.svgCache[hash]) {
      return { hash, svg: state.plantUML.svgCache[hash] };
    }

    try {
      const isNetlify = window.location.hostname.includes('netlify');
      const endpoint = isNetlify ? '/.netlify/functions/plantuml' : '/api/plantuml/svg';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagram }),
      });

      if (!response.ok) {
        throw new Error('Failed to render PlantUML diagram');
      }

      const svg = await response.text();
      return { hash, svg };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const plantUMLSlice = createSlice({
  name: 'plantUML',
  initialState,
  reducers: {
    clearCache: (state) => {
      state.svgCache = {};
      state.loading = {};
      state.errors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatePlantUMLSvg.pending, (state, action) => {
        const hash = hashString(action.meta.arg);
        state.loading[hash] = true;
        state.errors[hash] = null;
      })
      .addCase(generatePlantUMLSvg.fulfilled, (state, action) => {
        const { hash, svg } = action.payload;
        state.svgCache[hash] = svg;
        state.loading[hash] = false;
        state.errors[hash] = null;
      })
      .addCase(generatePlantUMLSvg.rejected, (state, action) => {
        const hash = hashString(action.meta.arg);
        state.loading[hash] = false;
        state.errors[hash] = action.payload as string;
      });
  },
});

export const { clearCache } = plantUMLSlice.actions;
export default plantUMLSlice.reducer;