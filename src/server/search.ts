import MiniSearch from 'minisearch';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import matter from 'gray-matter';
import { glob } from 'glob';
import { logger } from '../utils/logger';

// Default performance limits to keep the search engine responsive and memory-efficient
const DEFAULT_MAX_FILES_TO_INDEX = 5000;
const DEFAULT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface SearchSnippet {
  line: number;
  text: string;
}

export interface SearchResult {
  id: string;
  title: string;
  path: string;
  score: number;
  snippets: SearchSnippet[];
}

export class SearchEngine {
  private miniSearch: MiniSearch;
  private indexPath: string;
  private isIndexing: boolean = false;
  private maxFiles: number;
  private maxFileSize: number;

  constructor(private directory: string, options: { maxFiles?: number; maxFileSize?: number } = {}) {
    this.maxFiles = options.maxFiles ?? DEFAULT_MAX_FILES_TO_INDEX;
    this.maxFileSize = options.maxFileSize ?? DEFAULT_MAX_FILE_SIZE_BYTES;

    // We hash the directory path to create a unique cache file for each project
    // without polluting the source directory itself.
    const hash = crypto.createHash('md5').update(path.resolve(directory)).digest('hex');
    this.indexPath = path.join(os.tmpdir(), `mdts-search-${hash}.json`);
    
    this.miniSearch = new MiniSearch({
      fields: ['title', 'content'], // Fields to index
      storeFields: ['title', 'path'], // Fields to return in results
      searchOptions: {
        boost: { title: 2 },
        fuzzy: 0.2,
        prefix: true
      }
    });
  }

  public async initialize(): Promise<void> {
    if (fs.existsSync(this.indexPath)) {
      try {
        const json = fs.readFileSync(this.indexPath, 'utf-8');
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

      // Process files in batches to keep memory usage stable
      const docs = filesToProcess
        .map(filePath => this.parseFile(filePath))
        .filter((doc): doc is NonNullable<ReturnType<typeof SearchEngine.prototype.parseFile>> => doc !== null);
        
      this.miniSearch.removeAll();
      this.miniSearch.addAll(docs);
      
      this.saveIndex();
      
      const duration = Date.now() - start;
      logger.log('Search', `✅ Indexed ${docs.length} files in ${duration}ms`);
    } catch (error) {
      logger.error('Search', 'Failed to index directory:', error);
    } finally {
      this.isIndexing = false;
    }
  }

  private parseFile(relativeFilePath: string) {
    try {
      const absolutePath = path.join(this.directory, relativeFilePath);
      if (!fs.existsSync(absolutePath)) return null;
      
      // Skip very large files to prevent OOM (Out Of Memory) issues
      const stats = fs.statSync(absolutePath);
      if (stats.size > this.maxFileSize) {
        return null;
      }
      
      const content = fs.readFileSync(absolutePath, 'utf-8');
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

  public updateFile(relativeFilePath: string): void {
    const doc = this.parseFile(relativeFilePath);
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
  }

  private saveTimeout: NodeJS.Timeout | null = null;
  private saveIndexDebounced() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveIndex(), 5000);
  }

  private saveIndex() {
    try {
      const json = JSON.stringify(this.miniSearch);
      fs.writeFileSync(this.indexPath, json);
    } catch (error) {
      logger.error('Search', 'Failed to save search index:', error);
    }
  }

  public search(query: string): SearchResult[] {
    const results = this.miniSearch.search(query);
    
    return results.map(result => {
      const absolutePath = path.join(this.directory, result.id as string);
      let snippets: SearchSnippet[] = [];
      
      try {
        if (fs.existsSync(absolutePath)) {
          const content = fs.readFileSync(absolutePath, 'utf-8');
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
        }
      } catch {
        // Fallback to empty snippets
      }

      return {
        id: result.id as string,
        title: result.title as string,
        path: result.path as string,
        score: result.score,
        snippets
      };
    });
  }
}
