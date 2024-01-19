import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL;

  userRegister(user: User) {
    return this.http.post<{ user: User }>(`${this.baseUrl}/signup`, user);
  }
  userLogin(user: User) {
    return this.http.post<{ user: User }>(`${this.baseUrl}/login`, user);
  }
  getUserData() {
    return this.http.get<{ user: User }>(`${this.baseUrl}/user`);
  }

  setUser(user: User) {
    this.currentUserSubject.next(user);
  }

  getUser(): Observable<User | null> {
    return this.currentUser$;
  }
  logout() {
    return this.http.post<{ message: string }>(`${this.baseUrl}/logout`, {});
  }
}
