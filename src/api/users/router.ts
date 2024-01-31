import express, { NextFunction, Response } from 'express';

import { IRequest } from '../../common/types.js';
import { userService } from './service.js';
import { HttpError } from '../../common/errors/HttpError.js';
import { HttpStatusCode } from '../../common/constants/http.js';

export const userRouterV1 = express.Router();

userRouterV1.route('/check-email').post(checkEmail);
userRouterV1.route('/check-username').post(checkUsername);

interface ICheckEmail {
  email: string;
}

interface ICheckUsername {
  username: string;
}

async function checkEmail(req: IRequest<ICheckEmail>, res: Response, next: NextFunction) {
  try {
    const isEmailExists = await userService.isEmailExists(req.body.email);
    if (isEmailExists) {
      throw new HttpError(HttpStatusCode.CONFLICT, 'Email already exists');
    }
    res.status(HttpStatusCode.OK).send();
  } catch (err) {
    next(err);
  }
}

async function checkUsername(req: IRequest<ICheckUsername>, res: Response, next: NextFunction) {
  try {
    const isUsernameExists = await userService.isUsernameExists(req.body.username);
    if (isUsernameExists) {
      throw new HttpError(HttpStatusCode.CONFLICT, 'Username already exists');
    }
    res.status(HttpStatusCode.OK).send();
  } catch (err) {
    next(err);
  }
}
