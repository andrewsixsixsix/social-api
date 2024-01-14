import { Request } from 'express';
import { Query } from 'express-serve-static-core';
import { JwtPayload } from 'jsonwebtoken';

export interface IAuthJwtPayload extends JwtPayload {
  userId?: number;
}

export interface IRequest<T = any, U extends Query = Query> extends Request, IAuthJwtPayload {
  body: T;
  query: U;
}

export interface IUser {
  id?: number;
  firstName: string;
  lastName: string | null;
  username: string;
  email: string;
  password?: string;
}
