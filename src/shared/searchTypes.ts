export interface SearchSnippet {
  line: number;
  text: string;
}

export interface ContentSearchResult {
  id: string;
  title: string;
  path: string;
  snippets: SearchSnippet[];
}

export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  path: string;
}
