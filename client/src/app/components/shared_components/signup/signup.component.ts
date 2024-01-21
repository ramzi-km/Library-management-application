import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  signupForm!: FormGroup;
  errMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        this.noEmptySpacesValidator(),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('user', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        this.noSpaceValidation,
        Validators.pattern(/^(?=.*\d)(?=.*[a-zA-Z])/),
      ]),
    });
  }
  ngOnInit(): void {}

  get signupFormControls() {
    return this.signupForm.controls;
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
      .userRegister(this.signupForm.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.errMessage = null;
          this.loading = false;
          this.authService.setUser({ ...res.user, loggedIn: true });
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
