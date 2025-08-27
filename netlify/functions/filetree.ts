import { Handler, HandlerEvent, HandlerContext } from '@types/aws-lambda';
import { DEMO_FILE_TREE, FileTreeItem } from './demo-data';

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
    const requestPath = (event.path || '').replace('/api/filetree', '').replace('/.netlify/functions/filetree', '') || '';

    function findInTree(tree: FileTreeItem[], targetPath: string): FileTreeItem[] | null {
      if (!targetPath) {
        return tree;
      }
      
      for (const item of tree) {
        if (item.path === targetPath) {
          return item.type === 'directory' && item.children ? item.children : null;
        }
        
        if (item.type === 'directory' && item.children && targetPath.startsWith(item.path + '/')) {
          const result = findInTree(item.children, targetPath);
          if (result !== null) return result;
        }
      }
      
      return null;
    }

    const result = findInTree(DEMO_FILE_TREE, requestPath.replace(/^\/+/, ''));
    
    if (result === null) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Path not found' })
      };
    }

    // Convert FileTreeItem[] to frontend expected format
    const convertToFrontendFormat = (items: FileTreeItem[]): ({
      path: string;
      status: string;
    } | {
      [key: string]: ({
        path: string;
        status: string;
      } | object)[];
    })[] => {
      const converted: any[] = [];
      
      for (const item of items) {
        if (item.type === 'file') {
          converted.push({
            path: item.path,
            status: undefined
          });
        } else if (item.type === 'directory' && item.children) {
          converted.push({
            [item.name]: convertToFrontendFormat(item.children)
          });
        }
      }
      
      return converted;
    };

    const frontendFormat = convertToFrontendFormat(result);
    const response = requestPath === '' ? {
      fileTree: frontendFormat,
      mountedDirectoryPath: '/demo-content'
    } : frontendFormat;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Filetree function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

exports.handler = handler;
