import { Box, Tab, Tabs } from '@mui/material';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import useIsMobile from '../../../hooks/useIsMobile';
import { ViewMode } from '../../../hooks/useViewMode';
import { RootState } from '../../../store/store';

interface MarkdownContentTabsProps {
  viewMode: ViewMode;
  hasFrontmatter: boolean;
}

const MarkdownContentTabs: React.FC<MarkdownContentTabsProps> = ({ viewMode, hasFrontmatter }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isGitRepository } = useSelector((state: RootState) => state.fileTree);
  const { diff } = useSelector((state: RootState) => state.diff);
  const isMobile = useIsMobile();

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
        paddingLeft: isMobile ? '8px' : '24px',
        marginLeft: isMobile ? '-16px' : '-32px',
        marginRight: isMobile ? '-16px' : '-32px',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Tabs
        value={viewMode}
        onChange={handleChange}
        aria-label="view mode tabs"
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons={isMobile ? 'auto' : false}
        allowScrollButtonsMobile
      >
        <Tab value="preview" label="Preview" onClick={handleClick} />
        {hasFrontmatter && <Tab value="frontmatter" label="Frontmatter" />}
        <Tab value="raw" label="Raw" />
        {isGitRepository && !!diff && <Tab value="diff" label="Diff" />}
        {isGitRepository && <Tab value="diff-prev" label="Last Commit" />}
      </Tabs>
    </Box>
  );
};

export default MarkdownContentTabs;
