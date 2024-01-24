import { HttpParams } from '@angular/common/http';
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
  searchForm: FormGroup;
  searchText = '';
  page = 0;
  lastPage = 0;

  constructor(private bookService: BookService) {
    this.searchForm = new FormGroup({
      searchText: new FormControl('', [Validators.required]),
    });
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
          console.log(this.books);
          this.page=res.page
          this.lastPage=res.lastPage
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

  searchBooks() {
    if (!this.loading) {
      const formText = this.searchForm.value.searchText.trim();
      if (formText == this.searchText) {
        return;
      }
      this.searchText = formText;
      const params = new HttpParams()
        .set('page', 0)
        .set('searchText', this.searchText);
      this.loading = true;
      this.bookService
        .getAllBooks(params)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.books = res.books;
            this.loading = false;
            this.page = res.page;
            this.lastPage = res.lastPage;
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.loading = false;
          },
        });
    }
  }

  nextPage() {
    if (!this.loading) {
      const params = new HttpParams()
        .set('page', this.page + 1)
        .set('searchText', this.searchText);
      this.loading = true;
      this.bookService
        .getAllBooks(params)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.books = res.books;
            this.loading = false;
            this.page = res.page;
            this.lastPage = res.lastPage;
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.loading = false;
          },
        });
    }
  }
  prevPage() {
    if (!this.loading) {
      const params = new HttpParams()
        .set('page', this.page - 1)
        .set('searchText', this.searchText);
      this.loading = true;
      this.bookService
        .getAllBooks(params)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.books = res.books;
            this.loading = false;
            this.page = res.page;
            this.lastPage = res.lastPage;
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.loading = false;
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
