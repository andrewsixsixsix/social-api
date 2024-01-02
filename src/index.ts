import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 6969;

app.get('/', (_req: Request, res: Response) => {
  res.sendStatus(200);
});

app.listen(port, () => console.log(`Server started on port ${port}...`));
