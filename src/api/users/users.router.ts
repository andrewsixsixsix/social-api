import express from 'express';

import { login, logout, register } from './auth.service.js';

export const usersRouterV1 = express.Router();
export const usersRouterV2 = express.Router();

usersRouterV1.route('/register').post(register);
usersRouterV1.route('/login').post(login);
usersRouterV1.route('/logout').get(logout);
