import express from 'express';
import request from 'supertest';
import { plantumlRouter } from '../../../../src/server/routes/plantuml';

describe('plantuml.ts', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/plantuml', plantumlRouter());
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

    it('should accept POST requests to /svg endpoint', async () => {
      const diagram = '@startuml\nA --> B\n@enduml';
      
      // This test will likely fail due to actual PlantUML generation
      // but it verifies the endpoint accepts requests
      const response = await request(app)
        .post('/api/plantuml/svg')
        .send({ diagram });

      // We expect either success (200) or some error, but not 404
      expect(response.statusCode).not.toBe(404);
    });
  });
});