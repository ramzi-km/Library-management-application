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
import { ListBooksComponent } from './components/user_components/list-books/list-books.component';
import { ListBorrowedBooksComponent } from './components/user_components/list-borrowed-books/list-borrowed-books.component';
import { ListTransactionsComponent } from './components/admin_components/list-transactions/list-transactions.component';
import { UserManagementComponent } from './components/admin_components/user-management/user-management.component';
import { ProfileComponent } from './components/shared_components/profile/profile.component';

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
    ListBooksComponent,
    ListBorrowedBooksComponent,
    ListTransactionsComponent,
    UserManagementComponent,
    ProfileComponent,
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
