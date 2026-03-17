import { Box, Tab, Tabs } from '@mui/material';
import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ViewMode } from '../../../hooks/useViewMode';

interface MarkdownContentTabsProps {
  viewMode: ViewMode;
  hasFrontmatter: boolean;
}

const MarkdownContentTabs: React.FC<MarkdownContentTabsProps> = ({ viewMode, hasFrontmatter }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = useCallback((_: React.SyntheticEvent | null, newValue: ViewMode) => {
    searchParams.set('tab', newValue);
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const handleClick = useCallback(() => {
    handleChange(null, 'preview');
  }, [handleChange]);

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
        <Tab value="preview" label="Preview" onClick={handleClick} />
        {hasFrontmatter && <Tab value="frontmatter" label="Frontmatter" />}
        <Tab value="raw" label="Raw" />
        <Tab value="diff" label="Diff" />
        <Tab value="diff-prev" label="History" />
      </Tabs>
    </Box>
  );
};

export default MarkdownContentTabs;
