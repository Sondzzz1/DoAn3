// Custom Hook để quản lý Artworks - Dùng Context API
import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

export const useArtworks = () => {
  const { artworks } = useAppContext();

  // Lấy tranh nổi bật
  const featuredArtworks = useMemo(() => {
    return artworks.filter(artwork => artwork.isFeatured);
  }, [artworks]);

  // Lấy tranh bán chạy
  const bestSellingArtworks = useMemo(() => {
    return artworks.filter(artwork => artwork.isBestSelling);
  }, [artworks]);

  return {
    artworks,
    featuredArtworks,
    bestSellingArtworks,
  };
};
