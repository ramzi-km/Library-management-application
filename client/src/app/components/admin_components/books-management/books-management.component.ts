import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Book } from 'src/app/interfaces/book';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-books-management',
  templateUrl: './books-management.component.html',
  styleUrls: ['./books-management.component.scss'],
})
export class BooksManagementComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  loading = false;
  loadBooksErr = '';
  addBookForm!: FormGroup;
  addBookErrMessage = '';
  addBookLoading = false;
  books: Book[] = [];

  constructor(private bookService: BookService) {
    this.addBookForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        this.noEmptySpacesValidator(),
      ]),
      author: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        this.noEmptySpacesValidator(),
      ]),
      description: new FormControl('', [
        Validators.required,
        this.noEmptySpacesValidator(),
        Validators.maxLength(250),
        Validators.minLength(5),
      ]),
      isbn: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(5),
        this.noEmptySpacesValidator(),
      ]),
      quantityAvailable: new FormControl('', [Validators.required]),
      borrowLimit: new FormControl('', [Validators.required]),
      coverImage: new FormControl('', [Validators.required]),
    });
  }
  get addBookFormControls() {
    return this.addBookForm.controls;
  }
  noEmptySpacesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && value.trim().length < 3) {
        return { noEmptySpaces: true };
      }
      return null;
    };
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

  submitAddBookForm() {
    this.addBookLoading = true;
    this.bookService
      .addBook(this.addBookForm.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.addBookErrMessage = '';
          this.addBookLoading = false;
          this.books.push(res.book);
          this.closeAddBookModal();
        },
        error: (errMessage) => {
          this.addBookErrMessage = errMessage;
          this.addBookLoading = false;
        },
      });
  }

  showAddBookModal() {
    this.addBookForm.reset();
    this.addBookErrMessage = '';
    const addBookModal = document.getElementById(
      'addBookModal',
    ) as HTMLDialogElement;
    addBookModal.showModal();
  }
  closeAddBookModal() {
    const addBookModal = document.getElementById(
      'addBookModal',
    ) as HTMLDialogElement;
    addBookModal.close();
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.addBookForm.patchValue({
          coverImage: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
