import express, { Request, Response } from 'express';

import { login } from './users.service.js';

export const usersRouterV1 = express.Router();
export const usersRouterV2 = express.Router();

usersRouterV1.route('/register').post((_req: Request, res: Response) => {
  res.status(201);
  res.send('Register');
});

usersRouterV1.route('/login').post(login);

usersRouterV1.route('/logout').get((_req: Request, res: Response) => {
  res.status(200);
  res.send('Logout');
});
