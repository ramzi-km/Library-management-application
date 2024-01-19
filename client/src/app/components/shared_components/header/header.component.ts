import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user$!: Observable<User | null>;
  logoutLoading = false;

  ngOnInit(): void {
    this.user$ = this.authService.getUser();
  }
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  showLogoutModal() {
    const logoutModal = document.getElementById(
      'logoutModal',
    ) as HTMLDialogElement;
    logoutModal.showModal();
  }
  closeLogoutModal() {
    const logoutModal = document.getElementById(
      'logoutModal',
    ) as HTMLDialogElement;
    logoutModal.close();
  }

  logout(): void {
    if (!this.logoutLoading) {
      this.logoutLoading = true;
      this.authService.logout().subscribe({
        next: (res) => {
          this.authService.setUser({ loggedIn: false });
          this.logoutLoading = false;
          this.closeLogoutModal();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log(err);
          this.logoutLoading = false;
        },
      });
    }
  }
}
