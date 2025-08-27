import { Handler, HandlerEvent, HandlerContext } from '@types/aws-lambda';
import { DEMO_FILE_CONTENTS, WELCOME_CONTENT } from './demo-data';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Get and decode file path
  let requestPath = (event.path || '')
    .replace('/api/markdown', '')
    .replace('/.netlify/functions/markdown', '')
    .replace(/^\/+/, '');
  
  // URL decode the path in case it contains encoded characters
  if (requestPath) {
    try {
      requestPath = decodeURIComponent(requestPath);
    } catch (error) {
      // If decoding fails, use the original path
      console.warn('Failed to decode path:', requestPath, error);
    }
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'text/plain; charset=utf-8'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Handle welcome markdown
    if (event.path?.includes('mdts-welcome-markdown.md')) {
      return {
        statusCode: 200,
        headers,
        body: WELCOME_CONTENT
      };
    }

    // Handle demo content files 
    if (!requestPath) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No file path specified' })
      };
    }

    const content = DEMO_FILE_CONTENTS[requestPath];
    
    if (!content) {
      return {
        statusCode: 404,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'File not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: content
    };

  } catch (error) {
    console.error('Markdown function error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

exports.handler = handler;