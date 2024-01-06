import { NextFunction, Request, Response } from 'express';

import {
  ILogin,
  IRegistration,
  validateLoginData,
  validateRegistrationData,
} from './users.validator.js';

export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const login: ILogin = validateLoginData(req.body);
    res.status(200).send(login);
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).send();
  } catch (err) {
    next(err);
  }
};

export const register = (req: Request, res: Response, next: NextFunction) => {
  try {
    const registration: IRegistration = validateRegistrationData(req.body);
    res.status(200).send(registration);
  } catch (err) {
    next(err);
  }
};
