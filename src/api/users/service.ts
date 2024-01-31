import { userRepository } from './reporitory.js';
import { validator } from '../../common/validation/validator.js';

const isEmailExists = async (email: string) => {
  const e = validator.email(email);
  return await userRepository.isEmailExists(e);
};

const isUsernameExists = async (username: string) => {
  const u = validator.username(username);
  return await userRepository.isUsernameExists(u);
};

export const userService = { isEmailExists, isUsernameExists };
