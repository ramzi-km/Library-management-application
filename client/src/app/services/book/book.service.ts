import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from 'src/app/interfaces/book';
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
}
