import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private ngUnsubscribe = new Subject<void>();
  editProfileForm: FormGroup;
  editProfileErrMessage = '';
  editProfileLoading = false;
  user$ = this.authService.getUser();
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.editProfileForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        this.noEmptySpacesValidator(),
      ]),
    });
  }
  get editProfileFormControls() {
    return this.editProfileForm.controls;
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
  showEditProfileModal() {
    this.editProfileForm.reset();
    this.editProfileErrMessage = '';
    const editProfileModal = document.getElementById(
      'editProfileModal',
    ) as HTMLDialogElement;
    editProfileModal.showModal();
  }
  closeEditProfileModal() {
    const editProfileModal = document.getElementById(
      'editProfileModal',
    ) as HTMLDialogElement;
    editProfileModal.close();
  }
  submitEditProfileForm() {
    this.editProfileLoading = true;
    console.log(this.editProfileForm.value);
    this.userService
      .editProfile(this.editProfileForm.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.editProfileErrMessage = '';
          this.authService.setUser(res.user);
          this.editProfileLoading = false;
          this.closeEditProfileModal();
        },
        error: (errMessage) => {
          this.editProfileErrMessage = errMessage;
          this.editProfileLoading = false;
        },
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
