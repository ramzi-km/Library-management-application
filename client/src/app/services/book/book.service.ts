import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from 'src/app/interfaces/book';
import { Transaction } from 'src/app/interfaces/transaction';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL;
  getAllBooks() {
    return this.http.get<{ books: Book[] }>(`${this.baseUrl}/books`);
  }
  addBook(book: Book) {
    return this.http.post<{ book: Book }>(
      `${this.baseUrl}/admin/book/add`,
      book,
    );
  }
  editBook(book: Book, bookId: string) {
    return this.http.put<{ book: Book }>(
      `${this.baseUrl}/admin/book/${bookId}/edit`,
      book,
    );
  }

  borrowBook(bookId: string, body: { borrowQuantity: number }) {
    return this.http.post<{ borrowedBook: Book }>(
      `${this.baseUrl}/book/${bookId}/borrow`,
      body,
    );
  }
  returnBook(transactionId: string) {
    return this.http.patch<{ returnedTransaction: Transaction }>(
      `${this.baseUrl}/book/${transactionId}/return`,
      {},
    );
  }

  getBorrowedBooks() {
    return this.http.get<{ borrowedBooks: Transaction[] }>(
      `${this.baseUrl}/books/borrowed`,
    );
  }
}
