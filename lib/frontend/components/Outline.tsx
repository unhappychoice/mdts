import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { OutlineItem, fetchOutline } from '../api';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface OutlineProps {
  filePath: string;
  onItemClick: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Outline: React.FC<OutlineProps> = ({ filePath, onItemClick, isOpen, onToggle }) => {
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { refresh } = useWebSocketContext();

  useEffect(() => {
    const getOutline = async () => {
      if (filePath) {
        setLoading(true);
        const data = await fetchOutline(filePath);
        setOutline(data);
        setLoading(false);
      } else {
        setOutline([]);
        setLoading(false);
      }
    };
    getOutline();
  }, [filePath, refresh]);

  return (
    <Box sx={{
      width: isOpen ? '300px' : '66px',
      bgcolor: 'background.paper',
      p: isOpen ? 2 : 0.5, // Adjust padding when closed
      borderLeft: '1px solid',
      borderColor: 'divider',
      minHeight: '100%',
      flexShrink: 0,
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '34px', marginTop: isOpen ? '0' : '16px', marginBottom: 2 }}>
        <IconButton onClick={onToggle} size="small" sx={{ marginBottom: 0, marginLeft: isOpen ? '0' : '12px' }}>
          {isOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        {isOpen && (
          <Typography variant="h6" gutterBottom sx={{ marginLeft: 1, marginBottom: 0 }}>
            Outline
          </Typography>
        )}
      </Box>
      {isOpen && (
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <List dense>
            {outline.map((item, index) => (
              <ListItem button key={item.id} sx={{ pl: item.level * 2 }} onClick={() => onItemClick(item.id)}>
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
        )
      )}
    </Box>
  );
};

export default Outline;
