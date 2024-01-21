import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
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

  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.loading = true;
    this.adminService
      .getAllUsers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          console.log(res);
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
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
