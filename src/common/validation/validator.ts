import { schema } from './schema.js';
import { ICheckEmail, ICheckUsername, ILogin, IRegistration } from '../types.js';

const email = (body: ICheckEmail): string => schema.email.parse(body.email);
const loginData = (body: ILogin): ILogin => schema.login.parse(body);
const registrationData = (body: IRegistration): IRegistration => schema.registration.parse(body);
const username = (body: ICheckUsername): string => schema.username.parse(body.username);

export const validator = { email, loginData, registrationData, username };
