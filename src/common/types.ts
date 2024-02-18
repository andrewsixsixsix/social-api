import { Request } from 'express';
import { Query } from 'express-serve-static-core';
import { JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';

import { schema } from './validation/schema.js';

export interface IAuthJwtPayload extends JwtPayload {
  userId?: number;
}

export interface ICheckEmail {
  email: string;
}

export interface ICheckUsername {
  username: string;
}

export type ILogin = z.infer<typeof schema.login>;

export type IRegistration = z.infer<typeof schema.registration>;

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
  dateOfBirth: string;
  password?: string;
}
