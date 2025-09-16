import { Router } from 'express';
import { logger } from '../../utils/logger';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const plantuml = require('node-plantuml-back');

type PlantumlModule = {
  generate: (options: { format: string }) => {
    in: NodeJS.WritableStream;
    out: NodeJS.ReadableStream;
  };
};

const createSvgGenerator = (plantumlModule: PlantumlModule) => async (diagram: string) => {
  const svg = await new Promise<string>((resolve, reject) => {
    const gen = plantumlModule.generate({ format: 'svg' });
    let svgData = '';

    gen.out.on('data', (chunk: Buffer) => {
      svgData += chunk.toString();
    });

    gen.out.on('end', () => {
      resolve(svgData);
    });

    gen.out.on('error', (error: Error) => {
      reject(error);
    });

    gen.in.write(diagram);
    gen.in.end();
  });

  return svg;
};

export const plantumlRouter = (plantumlModule: PlantumlModule = plantuml): Router => {
  const router = Router();
  const generateSvg = createSvgGenerator(plantumlModule);

  router.post('/svg', async (req, res) => {
    const { diagram } = req.body;

    if (!diagram) {
      return res.status(400).send('diagram body parameter is required.');
    }

    try {
      const svg = await generateSvg(diagram);

      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    } catch (error) {
      logger.error('Error generating PlantUML diagram:', error);
      res.status(500).send('Error generating PlantUML diagram.');
    }
  });

  return router;
};
