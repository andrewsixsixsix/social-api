import { userRepository } from './reporitory.js';

const isEmailExists = async (email: string) => await userRepository.isEmailExists(email);

const isUsernameExists = async (username: string) =>
  await userRepository.isUsernameExists(username);

export const userService = { isEmailExists, isUsernameExists };
