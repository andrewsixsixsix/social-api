export interface IUser {
  id?: number;
  firstName: string;
  lastName: string | null;
  username: string;
  email: string;
  password?: string;
}
