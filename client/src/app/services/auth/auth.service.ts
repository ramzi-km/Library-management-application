import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL;

  userRegister(user: User) {
    return this.http.post<{ user: User }>(`${this.baseUrl}/signup`, user);
  }
  userLogin(user: User) {
    return this.http.post<{ user: User }>(`${this.baseUrl}/login`, user);
  }
}
