import { IRegistration } from './users.validator.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { pool } from '../../config/mysql.config.js';

interface IExists extends RowDataPacket {
  0: boolean;
}

const create = async (userData: IRegistration) => {
  try {
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
    const [res] = await pool.query<ResultSetHeader>(sql, userData);
    return res.insertId;
  } catch (err) {
    // TODO: throw ServerError?
    throw err;
  }
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
  const [rows] = await pool.query<IExists[]>(sql, { email });
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
  const [rows] = await pool.query<IExists[]>(sql, { username });
  return rows[0][0];
};

export const userRepository = { create, isEmailExists, isUsernameExists };
