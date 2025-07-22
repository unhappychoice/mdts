
import { useSearchParams } from 'react-router-dom';

export const useViewMode = (): 'preview' | 'frontmatter' | 'raw' => {
  const [searchParams] = useSearchParams();
  return (searchParams.get('tab') as 'preview' | 'frontmatter' | 'raw') || 'preview';
};
