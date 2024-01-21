import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from 'src/app/interfaces/transaction';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL;

  getAllTransactions() {
    return this.http.get<{ transactions: Transaction[] }>(
      `${this.baseUrl}/admin/transactions`,
    );
  }
  getAllUsers() {
    return this.http.get<{ users: User[] }>(`${this.baseUrl}/admin/allUsers`);
  }
}
