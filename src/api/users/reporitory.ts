import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { knexx } from '../../config/mysql.config.js';
import { IRegistration, IUser } from '../../common/types.js';

interface IExists extends RowDataPacket {
  isExists: number;
}

const create = async (userData: IRegistration) => {
  const sql = `
      INSERT INTO users (
        username,
        email,
        first_name,
        last_name,
        date_of_birth,
        password
      )
      VALUES (
        :username,
        :email,
        :firstName,
        :lastName,
        :dateOfBirth,
        :password
      );
  `;
  const [res] = await knexx.raw<ResultSetHeader[]>(sql, userData);
  return res.insertId;
};

const findByUsername = async (username: string): Promise<IUser | null> => {
  const res = await knexx
    .select(
      'id',
      'username',
      'email',
      { firstName: 'first_name' },
      { lastName: 'last_name' },
      { dateOfBirth: 'date_of_birth' },
      'password',
    )
    .from<IUser>('users')
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
      ) AS isExists;
  `;
  const res = await knexx.raw(sql, { email });
  // underlying mysql library returned [IExists[], FieldPacket[]]
  const rows = res[0] as IExists[];
  return !!rows[0].isExists;
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
      ) AS isExists;
  `;
  const res = await knexx.raw(sql, { username });
  // underlying mysql library returned [IExists[], FieldPacket[]]
  const rows = res[0] as IExists[];
  return !!rows[0].isExists;
};

export const userRepository = { create, findByUsername, isEmailExists, isUsernameExists };
