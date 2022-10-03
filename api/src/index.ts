import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import api from './routes/api';
import cors from 'cors'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8787;

app.use(cors())
app.use(express.json());

//todo disable
app.get('/', (req: Request, res: Response) => {
    res.send('<3');
});

// Call api routes
app.use('/api', api)

app.listen(port, () => {
    console.log(`[server]: Server is listening on port: ${port}`);
});