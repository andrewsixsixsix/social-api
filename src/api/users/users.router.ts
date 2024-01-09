import express, { NextFunction, Request, Response } from 'express';

import { userService } from './auth.service.js';
import { HttpHeader, HttpStatusCode } from '../../constants/http.js';
import { IUser } from './users.type.js';
import { ILogin, IRegistration } from './users.validator.js';
import { IRequest } from '../../common/types.js';

export const usersRouterV1 = express.Router();
export const usersRouterV2 = express.Router();

usersRouterV1.route('/register').post(handleRegistration);
usersRouterV1.route('/login').post(handleLogin);
usersRouterV1.route('/logout').get(handleLogout);

async function handleRegistration(
  req: IRequest<IRegistration>,
  res: Response<IUser>,
  next: NextFunction,
) {
  try {
    const user: IUser = await userService.register(req.body);
    res
      .header(HttpHeader.CONTENT_LOCATION, `/users/${user.id}`)
      .status(HttpStatusCode.CREATED)
      .json(user);
  } catch (err) {
    next(err);
  }
}

function handleLogin(req: IRequest<ILogin>, res: Response<ILogin>, next: NextFunction) {
  try {
    const login = userService.login(req.body);
    res.status(HttpStatusCode.OK).json(login);
  } catch (err) {
    next(err);
  }
}

function handleLogout(_req: Request, res: Response<ILogin>, next: NextFunction) {
  try {
    res.status(HttpStatusCode.OK).json();
  } catch (err) {
    next(err);
  }
}
