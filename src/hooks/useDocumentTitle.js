import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} - mezoo` : 'mezoo - Xem Phim Online';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
