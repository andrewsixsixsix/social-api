import { IRegistration } from './users.validator.js';
import { ResultSetHeader } from 'mysql2/promise';

import { pool } from '../../config/mysql.config.js';

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

export const userRepository = { create };
