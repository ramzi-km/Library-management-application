import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Book } from 'src/app/interfaces/book';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.scss'],
})
export class ListBooksComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();

  loading = true;
  loadBooksErr = '';
  books: Book[] = [];
  borrowBookForm: FormGroup;
  borrowBookErrMessage = '';
  bookToBorrow: Book | null = null;
  borrowBookLoading = false;

  constructor(private bookService: BookService) {
    this.borrowBookForm = new FormGroup({
      borrowQuantity: new FormControl('', [
        Validators.required,
        Validators.max(this.bookToBorrow?.borrowLimit!),
      ]),
    });
  }
  ngOnInit(): void {
    this.loading = true;
    this.bookService
      .getAllBooks()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.books = res.books;
          this.loadBooksErr = '';
          this.loading = false;
        },
        error: (errMessage) => {
          this.loadBooksErr = errMessage;
          this.loading = false;
        },
      });
  }
  get borrowBookFormControls() {
    return this.borrowBookForm.controls;
  }

  showborrowBookModal(book: Book) {
    this.borrowBookForm.reset();
    this.bookToBorrow = book;
    this.borrowBookErrMessage = '';
    const borrowBookModal = document.getElementById(
      'borrowBookModal',
    ) as HTMLDialogElement;
    borrowBookModal.showModal();
  }
  closeborrowBookModal() {
    const borrowBookModal = document.getElementById(
      'borrowBookModal',
    ) as HTMLDialogElement;
    borrowBookModal.close();
  }
  submitBorrowBookForm() {
    this.borrowBookLoading = true;
    this.bookService
      .borrowBook(this.bookToBorrow?._id!, this.borrowBookForm.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.borrowBookErrMessage = '';
          this.borrowBookLoading = false;
          this.closeborrowBookModal();
        },
        error: (errMessage) => {
          this.borrowBookErrMessage = errMessage;
          this.borrowBookLoading = false;
        },
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
