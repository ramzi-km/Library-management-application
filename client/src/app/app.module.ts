import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ErrorComponent } from './components/shared_components/error/error.component';
import { FooterComponent } from './components/shared_components/footer/footer.component';
import { HeaderComponent } from './components/shared_components/header/header.component';
import { LoginComponent } from './components/shared_components/login/login.component';
import { SignupComponent } from './components/shared_components/signup/signup.component';

import { AdminHomeComponent } from './components/admin_components/admin-home/admin-home.component';
import { UserHomeComponent } from './components/user_components/home/user-home/user-home.component';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { BooksManagementComponent } from './components/admin_components/books-management/books-management.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    UserHomeComponent,
    AdminHomeComponent,
    BooksManagementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
