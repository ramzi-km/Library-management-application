import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorComponent } from './components/shared_components/error/error.component';
import { FooterComponent } from './components/shared_components/footer/footer.component';
import { HeaderComponent } from './components/shared_components/header/header.component';
import { LoginComponent } from './components/shared_components/login/login.component';
import { SignupComponent } from './components/shared_components/signup/signup.component';
import { HomeComponent } from './components/user_components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    ErrorComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
