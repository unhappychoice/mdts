import { List } from '@mui/material';
import React from 'react';
import { OutlineListItem } from './OutlineListItem';
import { OutlineItem } from './types';

interface OutlineListProps {
  outline: OutlineItem[];
  onItemClick: (id: string) => void;
}

export const OutlineList: React.FC<OutlineListProps> = ({ outline, onItemClick }) => (
  <List dense className="custom-scrollbar" sx={{ overflowY: 'auto', height: 'calc(100vh - 132px)', px: 2 }}>
    {outline.map((item) => (
      <OutlineListItem key={item.id} item={item} onItemClick={onItemClick} />
    ))}
  </List>
);
