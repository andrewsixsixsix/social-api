import { z } from 'zod';

// schemas
const FirstName = z
  .string({
    required_error: 'First name is required',
    invalid_type_error: 'First name must be a string',
  })
  .regex(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, 'Invalid name value')
  .min(1, 'Minimum name length is 1 character')
  .max(32, 'Maximum name length is 32 characters');

const LastName = FirstName.nullable().default(null);

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
  .email({ message: 'Invalid email value' })
  .max(64, 'Maximum email length is 64 characters');

const Password = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8, 'Minimum password length is 8 characters')
  .max(64, 'Maximum password length is 64 characters');

const DateOfBirth = z
  .string({
    required_error: 'Date of birth is required',
    invalid_type_error: 'Date of birth must be a string',
  })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date. Example: 2023-12-31');

const Login = z.object({
  username: Username,
  password: Password,
});

const Registration = z
  .object({
    firstName: FirstName,
    lastName: LastName,
    username: Username,
    email: Email,
    password: Password,
    passwordConfirmation: z.string({
      required_error: 'Password confirmation is required',
      invalid_type_error: 'Password confirmation must be a string',
    }),
    dateOfBirth: DateOfBirth,
  })
  .refine((data) => data.password === data.passwordConfirmation, 'Passwords do not match')
  .transform((data) => ({
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    email: data.email,
    password: data.password,
    dateOfBirth: data.dateOfBirth,
  }));

// types
export type ILogin = z.infer<typeof Login>;
export type IRegistration = z.infer<typeof Registration>;

// validators
export const validateLoginData = (body: ILogin): ILogin => Login.parse(body);
export const validateRegistrationData = (body: IRegistration): IRegistration =>
  Registration.parse(body);
