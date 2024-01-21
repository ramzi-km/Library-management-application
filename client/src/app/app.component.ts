import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  title = 'client';
  loading = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loading = true;
    this.authService
      .getUserData()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.authService.setUser(res.user);
          this.loading = false;
        },
        error: (errMessage) => {
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
