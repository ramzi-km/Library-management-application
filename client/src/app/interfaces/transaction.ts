import { Book } from './book';
import { User } from './user';

export interface Transaction {
  _id?: string;
  userId?: string;
  bookId?: string;
  book?: Book;
  user?: User;
  borrowQuantity?: number;
  borrowDate?: Date;
  returnDate?: Date;
  status?: 'borrowed' | 'returned';
}
