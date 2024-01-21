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
  returnBookLoading = false;
  returnginBook!: Transaction;
  returnBookErrMessage = '';

  constructor(private bookService: BookService) {}
  ngOnInit(): void {
    this.loading = true;
    this.bookService
      .getBorrowedBooks()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
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

  showReturnBookModal(returningBook: Transaction) {
    this.returnginBook = returningBook;
    const returnBookModal = document.getElementById(
      'returnBookModal',
    ) as HTMLDialogElement;
    returnBookModal.showModal();
  }
  closeReturnBookModal() {
    const returnBookModal = document.getElementById(
      'returnBookModal',
    ) as HTMLDialogElement;
    returnBookModal.close();
  }
  returnBook() {
    this.returnBookLoading = true;
    this.bookService
      .returnBook(this.returnginBook._id!)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.returnBookErrMessage = '';
          this.borrowedBooks = this.borrowedBooks.filter(
            (book) => book._id !== res.returnedTransaction._id,
          );
          this.returnBookLoading = false;
          this.closeReturnBookModal();
        },
        error: (errMessage) => {
          this.returnBookErrMessage = errMessage;
          this.returnBookLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
