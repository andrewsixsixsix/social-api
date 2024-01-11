import crypto from 'crypto';

export const hashPassword = (password: string, username: string) =>
  crypto.createHash('sha256').update(password.concat(username)).digest('hex');
