import { NextFunction, Response } from 'express';

import { IRequest } from '../types.js';
import { validator } from '../validation/validator.js';

const API_V1 = '/api/v1';

const AUTH_V1 = `${API_V1}/auth`;
const USERS_V1 = `${API_V1}/users`;

export const validate = (req: IRequest, _res: Response, next: NextFunction) => {
  try {
    switch (req.originalUrl) {
      case `${AUTH_V1}/login`:
        validator.loginData(req.body);
        break;
      case `${AUTH_V1}/register`:
        validator.registrationData(req.body);
        break;
      case `${USERS_V1}/check-email`:
        validator.email(req.body);
        break;
      case `${USERS_V1}/check-username`:
        validator.username(req.body);
        break;
    }
    next();
  } catch (err: unknown) {
    next(err);
  }
};
