import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private ngUnsubscribe = new Subject<void>();
  loginForm!: FormGroup;
  errMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        this.noSpaceValidation,
        Validators.pattern(/^(?=.*\d)(?=.*[a-zA-Z])/),
      ]),
    });
  }
  get loginFormControls() {
    return this.loginForm.controls;
  }

  noSpaceValidation(control: AbstractControl): ValidationErrors | null {
    let controlValue = control.value as string;
    if (controlValue.indexOf(' ') >= 0) {
      return { noSpaceValidator: true };
    } else {
      return null;
    }
  }
  submitForm() {
    this.loading = true;
    this.authService
      .userLogin(this.loginForm.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.errMessage = null;
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (errMessage) => {
          this.errMessage = errMessage;
          this.loading = false;
        },
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
