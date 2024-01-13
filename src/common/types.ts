import { Request } from 'express';
import { Query } from 'express-serve-static-core';

export interface IRequest<T, U extends Query = Query> extends Request {
  body: T;
  query: U;
}

export interface IJwtPayload {
  [key: string]: string | number | boolean | object;
}
