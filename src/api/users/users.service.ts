import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const Login = z.object({
  username: z.string({
    required_error: 'Username is required',
    invalid_type_error: 'Username must be a string',
  }),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});

type ILogin = z.infer<typeof Login>;

export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginDetails: ILogin = Login.parse(req.body);
    res.status(200).send(loginDetails);
  } catch (err) {
    next(err);
  }
};
