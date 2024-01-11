import { IRegistration } from './users.validator.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { knexx } from '../../config/mysql.config.js';
import { IUser } from './users.type.js';

interface IExists extends RowDataPacket {
  0: boolean;
}

const create = async (userData: IRegistration) => {
  const sql = `
      INSERT INTO users (
        username,
        email,
        password,
        first_name,
        last_name
      )
      VALUES (
        :username,
        :email,
        :password,
        :firstName,
        :lastName
      );
  `;
  const [res] = await knexx.raw<ResultSetHeader[]>(sql, userData);
  return res.insertId;
};

const findByUsername = async (username: string): Promise<IUser | null> => {
  const res = await knexx<IUser>('users')
    .select('id', { firstName: 'first_name', lastName: 'last_name' }, 'username', 'email')
    .where({ username });
  return res.length == 0 ? null : res[0];
};

const isEmailExists = async (email: string): Promise<boolean> => {
  const sql = `
      SELECT EXISTS (
        SELECT
          *
        FROM
          users
        WHERE
          email = :email
      );
  `;
  const [rows] = await knexx.raw<IExists[][]>(sql, { email });
  return rows[0][0];
};

const isUsernameExists = async (username: string): Promise<boolean> => {
  const sql = `
      SELECT EXISTS (
        SELECT
          *
        FROM
          users
        WHERE
          username = :username
      );
  `;
  const [rows] = await knexx.raw<IExists[][]>(sql, { username });
  return rows[0][0];
};

export const userRepository = { create, isEmailExists, isUsernameExists };
