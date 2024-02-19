import crypto from 'node:crypto';

export const hashPassword = (password: string, username: string) =>
  crypto.createHash('sha256').update(password.concat(username)).digest('hex');
