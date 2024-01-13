import express, { NextFunction, Request, Response } from 'express';

import { authService } from './auth.service.js';
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
    const user: IUser = await authService.register(req.body);
    res
      .header(HttpHeader.CONTENT_LOCATION, `/users/${user.id}`)
      .status(HttpStatusCode.CREATED)
      .json(user);
  } catch (err) {
    next(err);
  }
}

async function handleLogin(req: IRequest<ILogin>, res: Response<IUser>, next: NextFunction) {
  try {
    const user = await authService.login(req.body);
    const { id, password, ...userData } = user;
    const jwe = authService.generateJwe({ id: id! });
    res.header(HttpHeader.AUTHORIZATION, `Bearer ${jwe}`).status(HttpStatusCode.OK).json(userData);
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
