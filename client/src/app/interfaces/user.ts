export interface User {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  loggedIn?: boolean;
  createdAt?: Date;
}
