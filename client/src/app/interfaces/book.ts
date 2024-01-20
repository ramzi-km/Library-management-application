export interface Book {
  _id?: string;
  title?: string;
  author?: string;
  coverImage?: string;
  description?: string;
  genre?: string;
  isbn?: string;
  quantityAvailable?: number;
  borrowLimit?: number;
}
