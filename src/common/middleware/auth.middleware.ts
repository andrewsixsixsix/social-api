import { NextFunction, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { HttpHeader, HttpStatusCode } from '../constants/http.js';
import { HttpError } from '../errors/HttpError.js';
import { IAuthJwtPayload, IRequest } from '../types.js';

export const authenticate = async (req: IRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header(HttpHeader.AUTHORIZATION);
    if (!authHeader) {
      throw new HttpError(HttpStatusCode.UNAUTHORIZED, 'Authorization header is missing');
    }
    // 'Authorization': 'Bearer JWE'
    const jwe = authHeader.split(' ')[1];
    const jws = await decryptJwe(jwe);
    const jwt = await decodeJws(jws);
    if (!isAuthJwtPayload(jwt)) {
      throw new Error('Invalid JWT payload');
    }
    req.userId = jwt.userId;
    next();
  } catch (err) {
    next(err);
  }
};

const decryptJwe = async (jwe: string) => {
  const key = process.env.JWE_PRIVATE_KEY;
  if (!key) {
    throw new Error('JWE private key is missing');
  }
  return crypto.privateDecrypt(key, Buffer.from(jwe, 'hex')).toString('utf8');
};

const decodeJws = (jws: string) => {
  const key = process.env.JWS_PUBLIC_KEY;
  if (!key) {
    throw new Error('JWS public key is missing');
  }
  return new Promise((res, rej) =>
    jwt.verify(jws, key, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        rej(err);
      }
      res(decoded);
    }),
  );
};

const isAuthJwtPayload = (payload: unknown): payload is IAuthJwtPayload =>
  payload != null && typeof payload === 'object' && 'userId' in payload;
