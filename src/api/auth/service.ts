import crypto from 'node:crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { userRepository } from '../users/reporitory.js';
import { HttpStatusCode } from '../../common/constants/http.js';
import { HttpError } from '../../common/errors/HttpError.js';
import { hashPassword } from './utils/hash-password.js';
import { ILogin, IRegistration, IUser } from '../../common/types.js';
import { sendEmail } from '../../common/services/email.service.js';

export const login = async (login: ILogin): Promise<IUser> => {
  const user = await userRepository.findByUsername(login.username);
  if (!user) {
    throw new HttpError(HttpStatusCode.NOT_FOUND, `User '${login.username}' not found`);
  }
  if (hashPassword(login.password, login.username) != user.password) {
    throw new HttpError(HttpStatusCode.UNAUTHORIZED, 'Wrong password');
  }
  return user;
};

export const logout = () => {};

export const register = async (registration: IRegistration): Promise<IUser> => {
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
  registration.password = hashPassword(registration.password, registration.username);
  const id = await userRepository.create(registration);
  const verificationLink = `http://localhost:6969/api/v1/users/verify/1234`;
  await sendEmail({
    to: registration.email,
    from: 'Social <eaakkount@gmail.com>',
    subject: 'Verify your Social account',
    text: 'Verify your Social account',
    html: `<p>Click the <a href=${verificationLink}>link</a> to verify your Social account</p>`,
    priority: 'high',
  });
  return {
    id,
    firstName: registration.firstName,
    lastName: registration.lastName,
    username: registration.username,
    email: registration.email,
    dateOfBirth: registration.dateOfBirth,
  };
};

// JWS(JWT)
const generateJws = (payload: JwtPayload): Promise<string> => {
  const privateKey = process.env.JWS_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('JWS private key is missing');
  }
  return new Promise((res, rej) =>
    jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '1h' }, (err, token) =>
      err ? rej(err) : res(token!),
    ),
  );
};

// JWE(JWS(JWT))
export const generateJwe = async (payload: JwtPayload) => {
  const jws = await generateJws(payload);
  const key = process.env.JWE_PUBLIC_KEY;
  if (!key) {
    throw new Error('JWE public key is missing');
  }
  return crypto.publicEncrypt(key, Buffer.from(jws)).toString('hex');
};

export const authService = { generateJwe, login, logout, register };
