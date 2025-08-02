import { Breadcrumbs, Link, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const BreadCrumb: React.FC<BreadCrumbProps> = ({ onDirectorySelect }) => {
  const { currentPath } = useSelector((state: RootState) => state.history);

  const pathSegments = currentPath ? currentPath.split('/').filter(segment => segment !== '') : [];

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const path = pathSegments.slice(0, index + 1).join('/');

        return isLast ? (
          <BreadCrumbText key={path} segment={segment} />
        ) : (
          <BreadCrumbLink key={path} path={path} segment={segment} onDirectorySelect={onDirectorySelect} />
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadCrumb;

interface BreadCrumbLinkProps {
  path: string;
  segment: string;
  onDirectorySelect?: (directoryPath: string) => void;
}

const BreadCrumbLink: React.FC<BreadCrumbLinkProps> = ({ path, segment, onDirectorySelect }) => {
  const handleClick = useCallback(() => {
    if (onDirectorySelect) onDirectorySelect(path);
  }, [path, onDirectorySelect]);

  return <Link color="inherit" href="#" onClick={handleClick}>{segment}</Link>;
};

interface BreadCrumbTextProps {
  segment: string;
}

const BreadCrumbText: React.FC<BreadCrumbTextProps> = ({ segment }) =>
  <Typography color="text.primary">{segment}</Typography>;

interface BreadCrumbProps {
  onDirectorySelect?: (directoryPath: string) => void;
}
