import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Transaction } from 'src/app/interfaces/transaction';
import { User } from 'src/app/interfaces/user';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
  private ngUnsubscribe = new Subject<void>();

  loading = true;
  loadUsersErr = '';
  users: User[] = [];
  currentUser: User | null = null;
  currentUserTransactions: Transaction[] = [];
  currUserTransactionsLoading = false;
  searchForm: FormGroup;
  searchText = '';
  page = 0;
  lastPage = 0;

  constructor(private adminService: AdminService) {
    this.searchForm = new FormGroup({
      searchText: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.loading = true;
    this.adminService
      .getAllUsers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.users = res.users;
          this.loadUsersErr = '';
          this.loading = false;
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.loadUsersErr = errMessage;
          this.loading = false;
        },
      });
  }
  showViewTransactionsModal(user: User) {
    this.currentUser = user;
    this.currUserTransactionsLoading = true;
    const viewTransactionsModal = document.getElementById(
      'viewTransactionsModal',
    ) as HTMLDialogElement;
    viewTransactionsModal.showModal();
    this.adminService
      .getUserTransactions(user._id!)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.currentUserTransactions = res.transactions;
          this.currUserTransactionsLoading = false;
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.currUserTransactionsLoading = false;
        },
      });
  }
  closeViewTransactionsModal() {
    const viewTransactionsModal = document.getElementById(
      'viewTransactionsModal',
    ) as HTMLDialogElement;
    viewTransactionsModal.close();
    this.currentUser = null;
    this.currentUserTransactions = [];
  }
  searchUser() {
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
      console.log(this.searchText);

      this.adminService
        .getAllUsers(params)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.users = res.users;
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
      this.adminService
        .getAllUsers(params)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.users = res.users;
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
      this.adminService
        .getAllUsers(params)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.users = res.users;
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
