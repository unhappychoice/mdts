import { Handler, HandlerEvent, HandlerContext } from '@types/aws-lambda';

// IP-based config storage with LRU cache (max 100 IPs, resets on function cold start)
const configCache = new Map<string, AppConfig>();
const MAX_CACHE_SIZE = 100;

function getClientIP(event: HandlerEvent): string {
  // Try various headers for client IP
  return event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         event.headers['x-real-ip'] ||
         event.headers['cf-connecting-ip'] ||
         event.requestContext?.identity?.sourceIp ||
         'unknown';
}

function setConfigForIP(ip: string, config: AppConfig) {
  // Remove if already exists (for LRU)
  if (configCache.has(ip)) {
    configCache.delete(ip);
  }
  
  // If cache is full, remove oldest entry
  if (configCache.size >= MAX_CACHE_SIZE) {
    const firstKey = configCache.keys().next().value;
    configCache.delete(firstKey);
  }
  
  configCache.set(ip, config);
}

function getConfigForIP(ip: string): AppConfig | null {
  const config = configCache.get(ip);
  if (config) {
    // Move to end for LRU
    configCache.delete(ip);
    configCache.set(ip, config);
    return config;
  }
  return null;
}

interface AppConfig {
  theme: string;
  fontSize: string;
  fontFamily: string;
  layout: string;
  sidebarWidth: number;
  showLineNumbers: boolean;
  autoSave: boolean;
  liveReload: boolean;
}

interface ConfigResponse extends AppConfig {
  availableThemes: Array<{
    id: string;
    name: string;
  }>;
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

  // Available themes list
  const availableThemes = [
    { id: 'default', name: 'Default' },
    { id: 'aurora', name: 'Aurora' },
    { id: 'autumn', name: 'Autumn' },
    { id: 'cafe', name: 'Café Mocha' },
    { id: 'deepsea', name: 'Deep Sea' },
    { id: 'forest', name: 'Forest' },
    { id: 'glacier', name: 'Glacier' },
    { id: 'inkblue', name: 'Ink Blue' },
    { id: 'inkstone', name: 'Inkstone' },
    { id: 'lavender', name: 'Lavender' },
    { id: 'moss', name: 'Moss' },
    { id: 'nightfox', name: 'Nightfox' },
    { id: 'ocean', name: 'Ocean' },
    { id: 'rosequartz', name: 'Rose Quartz' },
    { id: 'sakura', name: 'Sakura' },
    { id: 'sandstone', name: 'Sandstone' },
    { id: 'solarized', name: 'Solarized' },
    { id: 'storm', name: 'Storm' },
    { id: 'sunset', name: 'Sunset' },
    { id: 'tropical', name: 'Tropical' },
    { id: 'wisteria', name: 'Wisteria' }
  ];

  // Default demo configuration
  const defaultConfig: AppConfig = {
    theme: 'nightfox',  // Use a more distinctive theme for demo
    fontSize: '14px',
    fontFamily: 'Roboto',
    layout: 'default',
    sidebarWidth: 300,
    showLineNumbers: true,
    autoSave: false,
    liveReload: true
  };

  if (event.httpMethod === 'GET') {
    const clientIP = getClientIP(event);
    const userConfig = getConfigForIP(clientIP);
    
    const configResponse: ConfigResponse = {
      ...(userConfig || defaultConfig),
      availableThemes
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(configResponse)
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const requestBody = JSON.parse(event.body || '{}');
      
      // Validate theme if provided
      if (requestBody.theme && !availableThemes.find(t => t.id === requestBody.theme)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid theme' })
        };
      }
      
      // Update config for this IP
      const clientIP = getClientIP(event);
      const currentUserConfig = getConfigForIP(clientIP) || defaultConfig;
      
      const updatedUserConfig: AppConfig = {
        ...currentUserConfig,
        ...requestBody
      };
      
      setConfigForIP(clientIP, updatedUserConfig);
      
      const updatedConfig: ConfigResponse = {
        ...updatedUserConfig,
        availableThemes
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updatedConfig)
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON body' })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};

exports.handler = handler;
