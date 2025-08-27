import { Handler, HandlerEvent, HandlerContext } from '@types/aws-lambda';
import { encode } from 'plantuml-encoder';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'image/svg+xml'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { diagram } = body;

    if (!diagram) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'diagram body parameter is required' })
      };
    }

    const encoded = encode(diagram);
    const plantumlServerUrl = 'https://www.plantuml.com/plantuml';
    const svgUrl = `${plantumlServerUrl}/svg/${encoded}`;

    const response = await fetch(svgUrl);
    if (!response.ok) {
      throw new Error(`PlantUML server responded with ${response.status}`);
    }

    const svg = await response.text();

    return {
      statusCode: 200,
      headers,
      body: svg
    };

  } catch (error) {
    console.error('PlantUML function error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Error generating PlantUML diagram' })
    };
  }
};

exports.handler = handler;