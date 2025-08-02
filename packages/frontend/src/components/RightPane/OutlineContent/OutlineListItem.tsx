import { ListItem, ListItemText } from '@mui/material';
import React, { useCallback } from 'react';
import { OutlineItem } from './types';

interface OutlineListItemProps {
  item: OutlineItem;
  onItemClick: (id: string) => void;
}

export const OutlineListItem: React.FC<OutlineListItemProps> = ({ item, onItemClick }) => {
  const handleClick = useCallback(() => {
    onItemClick(item.id);
  }, [onItemClick, item.id]);

  return (
    <ListItem button key={item.id} sx={{ pl: item.level * 2 }} onClick={handleClick}>
      <ListItemText primary={item.content} sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} />
    </ListItem>
  );
};
