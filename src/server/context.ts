import { SearchEngine } from './search';

export interface ServerContext {
  directory: string;
  globPatterns?: string[];
  filePatterns?: string[];
  searchEngine?: SearchEngine;
  searchMaxFiles?: number;
  searchMaxFileSize?: number;
}
