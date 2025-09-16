import express from 'express';
import request from 'supertest';
import { PassThrough } from 'stream';
import { plantumlRouter } from '../../../../src/server/routes/plantuml';

const createPlantumlModule = (svg: string) => ({
  generate: jest.fn(() => {
    const inputStream = new PassThrough();
    const outputStream = new PassThrough();

    inputStream.on('finish', () => {
      outputStream.end(svg);
    });

    return { in: inputStream, out: outputStream };
  }),
});

describe('plantuml.ts', () => {
  let app: express.Application;
  let plantumlModule: ReturnType<typeof createPlantumlModule>;

  beforeEach(() => {
    plantumlModule = createPlantumlModule('<svg>diagram</svg>');
    app = express();
    app.use(express.json());
    app.use('/api/plantuml', plantumlRouter(plantumlModule));
  });

  describe('POST /svg', () => {
    it('should return 400 if diagram is not provided', async () => {
      const response = await request(app)
        .post('/api/plantuml/svg')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('diagram body parameter is required.');
    });

    it('should return 400 if diagram is empty string', async () => {
      const response = await request(app)
        .post('/api/plantuml/svg')
        .send({ diagram: '' });

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('diagram body parameter is required.');
    });

    it('should return generated SVG when diagram is provided', async () => {
      const diagram = '@startuml\nA --> B\n@enduml';
      const response = await request(app)
        .post('/api/plantuml/svg')
        .send({ diagram });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('image/svg+xml');
      const payload = response.text ?? response.body;
      const svgBody = Buffer.isBuffer(payload) ? payload.toString() : payload;
      expect(svgBody).toBe('<svg>diagram</svg>');
      expect(plantumlModule.generate).toHaveBeenCalledWith({ format: 'svg' });
    });
  });
});
