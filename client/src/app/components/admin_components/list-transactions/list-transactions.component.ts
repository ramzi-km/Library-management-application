import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Transaction } from 'src/app/interfaces/transaction';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-list-transactions',
  templateUrl: './list-transactions.component.html',
  styleUrls: ['./list-transactions.component.scss'],
})
export class ListTransactionsComponent {
  private ngUnsubscribe = new Subject<void>();
  loading = false;
  loadTransactionsErr = '';
  transactions: Transaction[] = [];

  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.loading = true;
    this.adminService
      .getAllTransactions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.transactions = res.transactions;
          this.loadTransactionsErr = '';
          this.loading = false;
        },
        error: (errMessage) => {
          this.loadTransactionsErr = errMessage;
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
