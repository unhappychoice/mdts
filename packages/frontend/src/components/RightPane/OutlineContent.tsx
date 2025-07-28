import { CircularProgress, List, ListItem, ListItemText, Box } from '@mui/material';
import React from 'react';

interface OutlineItem {
  id: string;
  level: number;
  content: string;
}

interface OutlineContentProps {
  outline: OutlineItem[];
  loading: boolean;
  error: string | null;
  onItemClick: (id: string) => void;
}

const OutlineContent: React.FC<OutlineContentProps> = ({ outline, loading, error, onItemClick }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 132px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <List dense sx={{ overflowY: 'auto', height: 'calc(100vh - 132px)' }}>
      {outline.map((item, index) => (
        <ListItem button key={`${item.id}-${index}`} sx={{ pl: item.level * 2 }} onClick={() => onItemClick(item.id)}>
          <ListItemText
            primary={item.content}
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default OutlineContent;
