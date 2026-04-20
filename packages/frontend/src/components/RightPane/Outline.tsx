import { Box, Drawer, useTheme } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useIsMobile from '../../hooks/useIsMobile';
import { fetchOutline } from '../../store/slices/outlineSlice';
import { AppDispatch, RootState } from '../../store/store';
import OutlineContent from './OutlineContent/OutlineContent';
import OutlineHeader from './OutlineHeader';

interface OutlineProps {
  filePath: string;
  onItemClick: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Outline: React.FC<OutlineProps> = ({ filePath, onItemClick, isOpen, onToggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { outline, loading, error } = useSelector((state: RootState) => state.outline);

  useEffect(() => {
    dispatch(fetchOutline(filePath));
  }, [dispatch, filePath]);

  const handleItemClickWithClose = useCallback((id: string) => {
    onItemClick(id);
    if (isMobile) onToggle();
  }, [onItemClick, isMobile, onToggle]);

  const panelContent = (
    <>
      <OutlineHeader isOpen={isMobile ? true : isOpen} onToggle={onToggle} />
      {(isMobile || isOpen) && (
        <OutlineContent
          outline={outline}
          loading={loading}
          error={error}
          onItemClick={isMobile ? handleItemClickWithClose : onItemClick}
        />
      )}
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        anchor="right"
        open={isOpen}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{ paper: { sx: { width: '280px', py: 2, background: theme.palette.background.paper, borderLeft: '1px solid', borderColor: 'divider' } } }}
      >
        {panelContent}
      </Drawer>
    );
  }

  return (
    <Box sx={{
      width: isOpen ? '300px' : '66px',
      py: 2,
      background: theme.palette.background.paper,
      borderLeft: '1px solid',
      borderColor: 'divider',
      minHeight: '100%',
      flexShrink: 0,
    }}>
      {panelContent}
    </Box>
  );
};

export default Outline;
