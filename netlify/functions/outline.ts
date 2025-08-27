import { Handler, HandlerEvent, HandlerContext } from '@types/aws-lambda';
import { DEMO_FILE_CONTENTS } from './demo-data';

interface OutlineItem {
  id: string;
  content: string;
  level: number;
}

// Simple markdown heading extractor for outline
function extractOutline(markdownContent: string): OutlineItem[] {
  const lines = markdownContent.split('\n');
  const outline: OutlineItem[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const slug = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      outline.push({
        id: slug,
        content: text,
        level
      });
    }
  }
  
  return outline;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Get file path from query parameter (filePath) or from path
    const queryParams = event.queryStringParameters || {};
    let requestPath = queryParams.filePath 
      ? decodeURIComponent(queryParams.filePath)
      : (event.path || '')
          .replace('/api/outline', '')
          .replace('/.netlify/functions/outline', '')
          .replace(/^\/+/, '');


    if (!requestPath) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No file path specified' })
      };
    }

    const content = DEMO_FILE_CONTENTS[requestPath];
    
    if (!content) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'File not found' })
      };
    }

    if (!requestPath.endsWith('.md') && !requestPath.endsWith('.markdown')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Path is not a markdown file' })
      };
    }

    const outline = extractOutline(content);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(outline)
    };

  } catch (error) {
    console.error('Outline function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

exports.handler = handler;