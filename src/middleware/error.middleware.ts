import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { HttpStatusCode } from '../constants/http.js';

export const handleError = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    handleUnprocessableContent(err, res);
  } else {
    handleAnyError(err, res);
  }
};

const handleAnyError = (err: unknown, res: Response) => {
  console.error(err);
  const response = {
    status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  };
  res.status(response.status).send(response);
};

const handleUnprocessableContent = (err: ZodError, res: Response) => {
  const message = err.errors.map((err) => err.message).join('. ');
  const response = {
    status: HttpStatusCode.UNPROCESSABLE_CONTENT,
    message: message,
  };
  res.status(response.status).send(response);
};
