import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} - Mezoo` : 'Mezoo - Xem Phim Online';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
