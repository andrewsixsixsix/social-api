import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';

import { HttpStatusCode } from '../constants/http.js';
import { HttpError } from '../errors/HttpError.js';

interface IErrorResponse {
  status: HttpStatusCode;
  message: string;
}

export const handleError = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let response: IErrorResponse;

  if (err instanceof ZodError) {
    response = handleUnprocessableContent(err);
  } else if (err instanceof HttpError) {
    response = handleHttpError(err);
  } else if (err instanceof jwt.JsonWebTokenError) {
    response = handleJwtError(err);
  } else {
    response = handleAnyError(err);
  }

  res.status(response.status).send(response);
};

const handleAnyError = (err: unknown): IErrorResponse => {
  console.error(err);
  return {
    status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  };
};

const handleHttpError = (err: HttpError): IErrorResponse => {
  return {
    status: err.statusCode,
    message: err.message,
  };
};

const handleJwtError = (err: jwt.JsonWebTokenError): IErrorResponse => {
  let message: string;

  switch (err.name) {
    case jwt.JsonWebTokenError.name:
    case jwt.NotBeforeError.name:
      message = 'JWT is malformed or invalid';
      break;
    case jwt.TokenExpiredError.name:
      message = 'JWT is expired';
      break;
    default:
      message = 'Failed to validate JWT';
  }

  return {
    status: HttpStatusCode.UNAUTHORIZED,
    message,
  };
};

const handleUnprocessableContent = (err: ZodError): IErrorResponse => {
  const message = err.errors.map((err) => err.message).join('. ');
  return {
    status: HttpStatusCode.UNPROCESSABLE_CONTENT,
    message: message,
  };
};
