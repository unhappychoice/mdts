import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

interface MarkdownContentTabsProps {
  viewMode: 'preview' | 'frontmatter' | 'raw';
  hasFrontmatter: boolean;
}

const MarkdownContentTabs: React.FC<MarkdownContentTabsProps> = ({ viewMode, hasFrontmatter }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event: React.SyntheticEvent, newValue: 'preview' | 'frontmatter' | 'raw') => {
    searchParams.set('tab', newValue);
    setSearchParams(searchParams);
  };

  return (
    <Box
      sx={{
        paddingLeft: '24px',
        marginLeft: '-32px',
        marginRight: '-32px',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Tabs value={viewMode} onChange={handleChange} aria-label="view mode tabs">
        <Tab value="preview" label="Preview" />
        {hasFrontmatter &&
          <Tab value="frontmatter" label="Frontmatter" />
        }
        <Tab value="raw" label="Raw" />
      </Tabs>
    </Box>
  );
};

export default MarkdownContentTabs;
