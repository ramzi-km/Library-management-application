import { Component } from '@angular/core';
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

  constructor(private adminService: AdminService) {}
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
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
