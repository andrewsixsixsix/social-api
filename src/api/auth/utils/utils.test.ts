// @ts-nocheck
import { hashPassword } from './hash-password.ts';

describe('Test auth utils', () => {
  it('password is hashed', () => {
    const password = 'password';
    const username = 'username';

    const hashed = hashPassword(password, username);

    const expected = '12fc00817ab00b8a18823810a9419cfee4280ff1fd9f77f11cccf32bc22fe498';

    expect(hashed).toBe(expected);
  });
});
