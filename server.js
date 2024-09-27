import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRouter from './routes/auth-routes';
import dbRouter from './routes/db-routes';
import cors from 'cors';
import path from 'path';

const app = express();
require('dotenv-safe').load({
  path: path.join(__dirname, './.env'),
  sample: path.join(__dirname, './.env.example'),
});
app.use(cors({
  origin: true,
  credentials: true
}));
const port = process.env.PORT || 5656;
const db = mongoose.connect(process.env.DB_ADDRESS, {
  useNewUrlParser: true
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api/', authRouter);
app.use('/api/drop', dbRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})