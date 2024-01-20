import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Transaction } from 'src/app/interfaces/transaction';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-list-borrowed-books',
  templateUrl: './list-borrowed-books.component.html',
  styleUrls: ['./list-borrowed-books.component.scss'],
})
export class ListBorrowedBooksComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  loading = false;
  loadBooksErr = '';
  borrowedBooks: Transaction[] = [];

  constructor(private bookService: BookService) {}
  ngOnInit(): void {
    this.loading = true;
    this.bookService
      .getBorrowedBooks()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.borrowedBooks = res.borrowedBooks;
          this.loadBooksErr = '';
          this.loading = false;
        },
        error: (errMessage) => {  
          this.loadBooksErr = errMessage;
          this.loading = false;
        },
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
