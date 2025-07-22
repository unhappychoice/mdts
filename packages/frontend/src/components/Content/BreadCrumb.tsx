import { Breadcrumbs, Link, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface BreadCrumbProps {
  onDirectorySelect?: (directoryPath: string) => void;
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ onDirectorySelect }) => {
  const { currentPath } = useSelector((state: RootState) => state.history);

  const pathSegments = currentPath ? currentPath.split('/').filter(segment => segment !== '') : [];

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const path = pathSegments.slice(0, index + 1).join('/');
        return isLast ? (
          <Typography key={path} color="text.primary">
            {segment}
          </Typography>
        ) : (
          <Link key={path} color="inherit" href="#" onClick={() => onDirectorySelect && onDirectorySelect(path)}>
            {segment}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadCrumb;
