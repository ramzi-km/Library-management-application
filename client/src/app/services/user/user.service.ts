import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL;

  editProfile(body: { name: string }) {
    return this.http.post<{ user: User }>(
      `${this.baseUrl}/user/editProfile`,
      body,
    );
  }
}
