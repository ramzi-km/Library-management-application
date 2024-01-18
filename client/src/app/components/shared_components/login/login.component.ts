import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  errMessage: string | null = null;
  loading: boolean = false;

  constructor() {
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
    console.log(this.loginForm.value);
  }
}
