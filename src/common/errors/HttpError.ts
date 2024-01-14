import { AppError } from './AppError.js';
import { HttpStatusCode } from '../constants/http.js';

export class HttpError extends AppError {
  constructor(
    readonly statusCode: HttpStatusCode,
    override readonly message: string,
  ) {
    super(message);
  }
}
