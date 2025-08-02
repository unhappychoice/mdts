import React from 'react';
import ErrorView from '../../ErrorView';
import { LoadingIndicator } from './LoadingIndicator';
import { OutlineList } from './OutlineList';
import { OutlineItem } from './types';

interface OutlineContentProps {
  outline: OutlineItem[];
  loading: boolean;
  error: string | null;
  onItemClick: (id: string) => void;
}

const OutlineContent: React.FC<OutlineContentProps> = ({ outline, loading, error, onItemClick }) => {
  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return <OutlineList outline={outline} onItemClick={onItemClick} />;
};

export default OutlineContent;
