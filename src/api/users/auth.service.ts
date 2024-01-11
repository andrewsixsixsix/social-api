import {
  ILogin,
  IRegistration,
  validateLoginData,
  validateRegistrationData,
} from './users.validator.js';
import { IUser } from './users.type.js';
import { userRepository } from './users.reporitory.js';
import { HttpStatusCode } from '../../constants/http.js';
import { HttpError } from '../../common/errors/HttpError.js';

export const login = async (loginData: ILogin): Promise<IUser> => {
  const login: ILogin = validateLoginData(loginData);
  const user = await userRepository.findByUsername(login.username);
  if (!user) {
    throw new HttpError(HttpStatusCode.NOT_FOUND, `User '${login.username}' not found`);
  }
  return user;
};

export const logout = () => {};

export const register = async (registrationData: IRegistration): Promise<IUser> => {
  const registration: IRegistration = validateRegistrationData(registrationData);
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
  return {
    id,
    firstName: registration.firstName,
    lastName: registration.lastName,
    username: registration.username,
    email: registration.email,
  };
};

export const userService = { login, logout, register };
