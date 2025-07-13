import React, { useState, useEffect } from 'react';
import { fetchContent } from '../api';
import MarkdownPreview from './MarkdownPreview';

interface ContentProps {
  selectedFilePath: string | null;
}

const Content: React.FC<ContentProps> = ({ selectedFilePath }) => {
  const [content, setContent] = useState<string>("");
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  useEffect(() => {
    const getContent = async () => {
      if (selectedFilePath) {
        const fileContent = await fetchContent(selectedFilePath);
        setContent(fileContent);
      } else {
        setContent("Please select a file from the tree.");
      }
    };
    getContent();
  }, [selectedFilePath]);

  const displayFileName = selectedFilePath ? selectedFilePath.split('/').pop() : "No file selected";

  return (
    <div className="flex-1 p-4">
      <h2 className="text-xl font-bold mb-4">
        {displayFileName}
      </h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setViewMode('preview')}
          className={`px-4 py-2 rounded-l-md ${viewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
        >
          Preview
        </button>
        <button
          onClick={() => setViewMode('raw')}
          className={`px-4 py-2 rounded-r-md ${viewMode === 'raw' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
        >
          Raw
        </button>
      </div>
      {viewMode === 'preview' ? (
        <MarkdownPreview content={content} />
      ) : (
        <pre className="whitespace-pre-wrap p-4 bg-gray-100 dark:bg-gray-800 rounded-md">{content}</pre>
      )}
    </div>
  );
};

export default Content;