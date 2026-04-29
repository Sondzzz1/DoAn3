// Recoil Selectors - Derived state
import { selector } from 'recoil';
import { cartState, artworksState, searchQueryState } from './atoms';

// Tính tổng số lượng sản phẩm trong giỏ hàng
export const cartCountSelector = selector({
  key: 'cartCountSelector',
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((total, item) => total + item.quantity, 0);
  },
});

// Tính tổng tiền trong giỏ hàng
export const cartTotalSelector = selector({
  key: 'cartTotalSelector',
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
});

// Lọc tranh theo từ khóa tìm kiếm
export const filteredArtworksSelector = selector({
  key: 'filteredArtworksSelector',
  get: ({ get }) => {
    const artworks = get(artworksState);
    const query = get(searchQueryState).toLowerCase();
    
    if (!query) return artworks;
    
    return artworks.filter(artwork =>
      artwork.tenTranh.toLowerCase().includes(query) ||
      artwork.tacGia.toLowerCase().includes(query) ||
      artwork.danhMuc.toLowerCase().includes(query)
    );
  },
});

// Lấy tranh nổi bật
export const featuredArtworksSelector = selector({
  key: 'featuredArtworksSelector',
  get: ({ get }) => {
    const artworks = get(artworksState);
    return artworks.filter(artwork => artwork.isFeatured);
  },
});

// Lấy tranh bán chạy
export const bestSellingArtworksSelector = selector({
  key: 'bestSellingArtworksSelector',
  get: ({ get }) => {
    const artworks = get(artworksState);
    return artworks.filter(artwork => artwork.isBestSelling);
  },
});
