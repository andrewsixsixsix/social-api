import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import { v1, v2 } from './router.js';
import { handleError } from './middleware/error.middleware.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 6969;

app.use('/api', v1);
app.use('/api', v2);

app.use(handleError);

app.use((_req: Request, res: Response) => res.sendStatus(404));

app.listen(port, () => console.log(`Server started on port ${port}...`));
