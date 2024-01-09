import { NextFunction, Request, Response } from 'express';

import {
  ILogin,
  IRegistration,
  validateLoginData,
  validateRegistrationData,
} from './users.validator.js';
import { IUser } from './users.type.js';
import { userRepository } from './users.reporitory.js';
import { HttpHeader, HttpStatusCode } from '../../constants/http.js';
import { HttpError } from '../../common/errors/HttpError.js';

export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const login: ILogin = validateLoginData(req.body);
    res.status(HttpStatusCode.OK).send(login);
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(HttpStatusCode.OK).send();
  } catch (err) {
    next(err);
  }
};

// TODO: send response and catch error in router? To omit passing req, res and next to service layer
//  so pass only request body with registration data here
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registration: IRegistration = validateRegistrationData(req.body);
    const [isEmailExists, isUsernameExists] = await Promise.all([
      userRepository.isEmailExists(registration.email),
      userRepository.isUsernameExists(registration.username),
    ]);
    if (isEmailExists || isUsernameExists) {
      const message =
        isEmailExists && isUsernameExists
          ? 'Email and username already exist'
          : `${isEmailExists ? 'Email' : 'Username'} already exists`;
      throw new HttpError(HttpStatusCode.CONFLICT, message);
    }
    const id = await userRepository.create(registration);
    const user: IUser = {
      id,
      firstName: registration.firstName,
      lastName: registration.lastName,
      username: registration.username,
      email: registration.email,
    };
    res
      .setHeader(HttpHeader.CONTENT_LOCATION, `/users/${id}`)
      .status(HttpStatusCode.CREATED)
      .send(user);
  } catch (err) {
    next(err);
  }
};
