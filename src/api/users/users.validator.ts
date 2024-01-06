import { z } from 'zod';

// schemas
const Name = z
  .string()
  .regex(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, 'Invalid name value')
  .nullable()
  .default(null);

const Username = z
  .string({
    required_error: 'Username is required',
    invalid_type_error: 'Username must be a string',
  })
  .regex(/^(?!.*(\.)\1)[A-Za-z_][A-Za-z0-9_.]{3,}$/, 'Invalid username value')
  .min(4, 'Minimum username length is 4 characters')
  .max(32, 'Maximum username length is 32 characters');

const Email = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
  .email({ message: 'Invalid email value' });

const Password = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8, 'Minimum password length is 8 characters')
  .max(64, 'Maximum password length is 64 characters');

const Login = z.object({
  username: Username,
  password: Password,
});

const Registration = z
  .object({
    firstName: Name,
    lastName: Name,
    username: Username,
    email: Email,
    password: Password,
    passwordConfirmation: z.string({
      required_error: 'Password confirmation is required',
      invalid_type_error: 'Password confirmation must be a string',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, 'Passwords do not match');

// types
export type ILogin = z.infer<typeof Login>;
export type IRegistration = z.infer<typeof Registration>;

// validators
export const validateLoginData = (body: any): ILogin => Login.parse(body);
export const validateRegistrationData = (body: any): IRegistration => Registration.parse(body);
