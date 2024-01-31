import { schema } from './schema.js';
import { ILogin, IRegistration } from '../types.js';

const email = (email: string): string => schema.email.parse(email);
const loginData = (body: ILogin): ILogin => schema.login.parse(body);
const registrationData = (body: IRegistration): IRegistration => schema.registration.parse(body);
const username = (username: string): string => schema.username.parse(username);

export const validator = { email, loginData, registrationData, username };
