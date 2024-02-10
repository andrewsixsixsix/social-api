import express, { NextFunction, Response } from 'express';

import { authenticate } from '../../common/middleware/auth.middleware.js';
import { ILogin, IRegistration, IRequest, IUser } from '../../common/types.js';
import { authService } from './service.js';
import { HttpHeader, HttpStatusCode } from '../../common/constants/http.js';

export const authRouterV1 = express.Router();
export const authRouterV2 = express.Router();

authRouterV1.route('/register').post(handleRegistration);
authRouterV1.route('/login').post(handleLogin);
authRouterV1.route('/logout').get(authenticate, handleLogout);

async function handleRegistration(
  req: IRequest<IRegistration>,
  res: Response<IUser>,
  next: NextFunction,
) {
  try {
    const { id, ...user }: IUser = await authService.register(req.body);
    const jwe = await authService.generateJwe({ userId: id! });
    res
      .header(HttpHeader.CONTENT_LOCATION, `/users/${id}`)
      .header(HttpHeader.AUTHORIZATION, `Bearer ${jwe}`)
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
    const jwe = await authService.generateJwe({ userId: id! });
    res.header(HttpHeader.AUTHORIZATION, `Bearer ${jwe}`).status(HttpStatusCode.OK).json(userData);
  } catch (err) {
    next(err);
  }
}

function handleLogout(_req: IRequest, res: Response<ILogin>, next: NextFunction) {
  try {
    res.status(HttpStatusCode.OK).json();
  } catch (err) {
    next(err);
  }
}
