import MiniSearch from 'minisearch';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import matter from 'gray-matter';
import { glob } from 'glob';
import { logger } from '../utils/logger';

import { SearchDocument, ContentSearchResult, SearchSnippet } from '../shared/searchTypes';

// Default performance limits to keep the search engine responsive and memory-efficient
const DEFAULT_MAX_FILES_TO_INDEX = 5000;
const DEFAULT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export class SearchEngine {
  private miniSearch: MiniSearch;
  private indexPath: string;
  private isIndexing: boolean = false;
  private maxFiles: number;
  private maxFileSize: number;
  private queue: Promise<void> = Promise.resolve();

  private async enqueue<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task);
    this.queue = result.then(() => {}).catch(() => {});
    return result;
  }

  constructor(private directory: string, options: { maxFiles?: number; maxFileSize?: number } = {}) {
    this.maxFiles = options.maxFiles ?? DEFAULT_MAX_FILES_TO_INDEX;
    this.maxFileSize = options.maxFileSize ?? DEFAULT_MAX_FILE_SIZE_BYTES;

    // We hash the directory path and indexing options to create a unique cache file
    // that invalidates if the limits change.
    const hash = crypto.createHash('md5')
      .update(path.resolve(directory))
      .update(String(this.maxFiles))
      .update(String(this.maxFileSize))
      .digest('hex');
    this.indexPath = path.join(os.tmpdir(), `mdts-search-${hash}.json`);
    
    this.miniSearch = new MiniSearch({
      fields: ['title', 'content'], // Fields to index
      storeFields: ['title', 'path'], // Fields to return in results
      searchOptions: {
        boost: { title: 2 },
        prefix: true
      }
    });
  }

  public async initialize(): Promise<void> {
    if (fs.existsSync(this.indexPath)) {
      try {
        const json = await fs.promises.readFile(this.indexPath, 'utf-8');
        this.miniSearch = MiniSearch.loadJSON(json, {
          fields: ['title', 'content'],
          storeFields: ['title', 'path']
        });
        logger.log('Search', '✅ Loaded search index from cache');
        
        // Refresh index in background to capture any changes while the server was off
        this.indexDirectoryInBackground();
      } catch {
        logger.error('Search', 'Failed to load search index cache');
        await this.indexDirectory();
      }
    } else {
      await this.indexDirectory();
    }
  }

  private indexDirectoryInBackground() {
    setTimeout(() => this.indexDirectory(), 1000);
  }

  /**
   * Scans the directory for markdown files and populates the search index.
   * This is done asynchronously to avoid blocking the main event loop.
   */
  public async indexDirectory(): Promise<void> {
    if (this.isIndexing) return;
    this.isIndexing = true;
    
    logger.log('Search', '🔍 Indexing directory...');
    const start = Date.now();
    
    return this.enqueue(async () => {
      try {
        // Use async glob to prevent blocking the event loop during file discovery
        const files = await glob('**/*.{md,markdown}', {
          cwd: this.directory,
          ignore: ['node_modules/**', '.git/**'],
          absolute: false
        });

        // Limit the number of files to prevent memory exhaustion in massive monorepos
        const filesToProcess = files.slice(0, this.maxFiles);
        if (files.length > this.maxFiles) {
          logger.log('Search', `⚠️ Too many files (${files.length}). Capping index at ${this.maxFiles}.`);
        }

        // Process files in chunks to avoid overwhelming file I/O and keep memory usage stable
        const docs: SearchDocument[] = [];
        const CHUNK_SIZE = 50;
        
        for (let i = 0; i < filesToProcess.length; i += CHUNK_SIZE) {
          const chunk = filesToProcess.slice(i, i + CHUNK_SIZE);
          const parsed = await Promise.all(chunk.map(filePath => this.parseFile(filePath)));
          docs.push(...parsed.filter((doc): doc is SearchDocument => doc !== null));
        }
          
        this.miniSearch.removeAll();
        this.miniSearch.addAll(docs);
        
        await this.saveIndex();
        
        const duration = Date.now() - start;
        logger.log('Search', `✅ Indexed ${docs.length} files in ${duration}ms`);
      } catch (error) {
        logger.error('Search', 'Failed to index directory:', error);
      } finally {
        this.isIndexing = false;
      }
    });
  }

  private async parseFile(relativeFilePath: string): Promise<SearchDocument | null> {
    try {
      const canonicalDir = await fs.promises.realpath(this.directory);
      const absolutePath = path.join(this.directory, relativeFilePath);
      const canonicalPath = await fs.promises.realpath(absolutePath);

      const relative = path.relative(canonicalDir, canonicalPath);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        return null;
      }
      
      // Skip very large files to prevent OOM (Out Of Memory) issues
      const stats = await fs.promises.stat(canonicalPath);
      if (stats.size > this.maxFileSize) {
        return null;
      }
      
      const content = await fs.promises.readFile(canonicalPath, 'utf-8');
      const { data, content: body } = matter(content);
      
      return {
        id: relativeFilePath,
        title: (data.title as string) || path.basename(relativeFilePath),
        content: body,
        path: relativeFilePath
      };
    } catch {
      return null;
    }
  }

  public async updateFile(relativeFilePath: string): Promise<void> {
    return this.enqueue(async () => {
      this.isIndexing = true;
      try {
        const doc = await this.parseFile(relativeFilePath);
        if (doc) {
          if (this.miniSearch.has(relativeFilePath)) {
            this.miniSearch.replace(doc);
          } else {
            this.miniSearch.add(doc);
          }
          this.saveIndexDebounced();
        } else if (this.miniSearch.has(relativeFilePath)) {
          this.miniSearch.remove({ id: relativeFilePath });
          this.saveIndexDebounced();
        }
      } finally {
        this.isIndexing = false;
      }
    });
  }

  private saveTimeout: NodeJS.Timeout | null = null;
  private saveIndexDebounced() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveIndex(), 5000);
  }

  private async saveIndex() {
    try {
      const json = JSON.stringify(this.miniSearch);
      await fs.promises.writeFile(this.indexPath, json);
    } catch (error) {
      logger.error('Search', 'Failed to save search index:', error);
    }
  }

  public async search(query: string): Promise<ContentSearchResult[]> {
    const results = this.miniSearch.search(query);
    const searchResults: ContentSearchResult[] = [];
    
    // Process results in chunks to avoid overwhelming file I/O
    const CHUNK_SIZE = 32;
    for (let i = 0; i < results.length; i += CHUNK_SIZE) {
      const chunk = results.slice(i, i + CHUNK_SIZE);
      const partial = await Promise.all(chunk.map(async result => {
        try {
          const canonicalDir = await fs.promises.realpath(this.directory);
          const absolutePath = path.resolve(this.directory, result.id as string);
          const canonicalPath = await fs.promises.realpath(absolutePath);
          
          // Security check: ensure the file is within the mounted directory
          const relative = path.relative(canonicalDir, canonicalPath);
          if (relative.startsWith('..') || path.isAbsolute(relative)) {
            return {
              id: result.id as string,
              title: result.title as string,
              path: result.path as string,
              snippets: []
            };
          }

          let snippets: SearchSnippet[] = [];
          
          try {
            const content = await fs.promises.readFile(canonicalPath, 'utf-8');
            const lines = content.split('\n');
            const lowerQuery = query.toLowerCase();
            
            lines.forEach((line, index) => {
              if (line.toLowerCase().includes(lowerQuery)) {
                snippets.push({
                  line: index + 1,
                  text: line
                });
              }
            });
            
            // Limit snippets per file
            if (snippets.length > 5) {
              snippets = snippets.slice(0, 5);
            }
          } catch {
            // Fallback to empty snippets
          }

          return {
            id: result.id as string,
            title: result.title as string,
            path: result.path as string,
            snippets
          };
        } catch {
          return {
            id: result.id as string,
            title: result.title as string,
            path: result.path as string,
            snippets: []
          };
        }
      }));
      searchResults.push(...partial);
    }

    return searchResults;
  }
}
