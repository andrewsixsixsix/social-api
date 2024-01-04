import express from 'express';

import { usersRouterV1, usersRouterV2 } from './modules/users/router.ts';

export const v1 = express.Router();
export const v2 = express.Router();

v1.use('/v1/users', usersRouterV1);

v2.use('/v2/users', usersRouterV2);
