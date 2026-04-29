// Recoil Atoms - Quản lý state toàn cục
import { atom } from 'recoil';
import { User, CartItem, Artwork } from '../types';

// State cho user hiện tại
export const currentUserState = atom<User | null>({
  key: 'currentUserState',
  default: null,
});

// State cho giỏ hàng
export const cartState = atom<CartItem[]>({
  key: 'cartState',
  default: [],
});

// State cho danh sách tranh
export const artworksState = atom<Artwork[]>({
  key: 'artworksState',
  default: [],
});

// State cho tìm kiếm
export const searchQueryState = atom<string>({
  key: 'searchQueryState',
  default: '',
});

// State cho loading
export const loadingState = atom<boolean>({
  key: 'loadingState',
  default: false,
});
