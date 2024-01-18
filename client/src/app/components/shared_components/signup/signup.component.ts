import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errMessage: string | null = null;
  loading: boolean = false;

  constructor() {
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
      if (value && value.trim().length < 5) {
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
    console.log(this.signupForm.value);
  }
}
