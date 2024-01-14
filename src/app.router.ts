import express from 'express';

import { authRouterV1, authRouterV2 } from './api/auth/router.js';

export const v1 = express.Router();
export const v2 = express.Router();

v1.use('/v1/auth', authRouterV1);

v2.use('/v2/auth', authRouterV2);
