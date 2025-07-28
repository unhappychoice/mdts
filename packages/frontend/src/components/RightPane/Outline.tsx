import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchOutline } from '../../store/slices/outlineSlice';
import OutlineHeader from './OutlineHeader';
import OutlineContent from './OutlineContent';

interface OutlineProps {
  filePath: string;
  onItemClick: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Outline: React.FC<OutlineProps> = ({ filePath, onItemClick, isOpen, onToggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { outline, loading, error } = useSelector((state: RootState) => state.outline);

  useEffect(() => {
    dispatch(fetchOutline(filePath));
  }, [dispatch, filePath]);

  return (
    <Box sx={{
      width: isOpen ? '300px' : '66px',
      py: 2,
      bgcolor: 'background.paper',
      borderLeft: '1px solid',
      borderColor: 'divider',
      minHeight: '100%',
      flexShrink: 0,
    }}>
      <OutlineHeader isOpen={isOpen} onToggle={onToggle} />
      {isOpen && (
        <OutlineContent
          outline={outline}
          loading={loading}
          error={error}
          onItemClick={onItemClick}
        />
      )}
    </Box>
  );
};

export default Outline;
