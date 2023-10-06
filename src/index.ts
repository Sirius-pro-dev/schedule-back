import { connect } from './db';
import 'dotenv/config';
import express from 'express';
import { router } from './routes';
import { errorHandling } from './middleware/ErrorHandlingMiddleware';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/api', router);
app.use(cors());

app.use(errorHandling);

const PORT = process.env.APP_PORT || 5000;

const start = async () => {
  try {
    connect();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
