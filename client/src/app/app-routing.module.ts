import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './components/admin_components/admin-home/admin-home.component';
import { ErrorComponent } from './components/shared_components/error/error.component';
import { LoginComponent } from './components/shared_components/login/login.component';
import { ProfileComponent } from './components/shared_components/profile/profile.component';
import { SignupComponent } from './components/shared_components/signup/signup.component';
import { UserHomeComponent } from './components/user_components/home/user-home/user-home.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { loginAndSignupGuard } from './guards/login-and-signup.guard';
import { profileGuard } from './guards/profile.guard';
import { userAuthGuard } from './guards/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserHomeComponent,
    canActivate: [userAuthGuard],
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
    canActivate: [adminAuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [profileGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginAndSignupGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [loginAndSignupGuard],
  },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
