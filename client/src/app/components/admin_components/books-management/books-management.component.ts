import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-books-management',
  templateUrl: './books-management.component.html',
  styleUrls: ['./books-management.component.scss'],
})
export class BooksManagementComponent {
  addBookForm!: FormGroup;
  addBookErrMessage = '';
  addBookLoading = false;
  submitAddBookForm() {}

  showAddBookModal() {
    // this.addBookForm.reset();
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
}
