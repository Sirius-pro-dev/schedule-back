import { connect } from './db';
import 'dotenv/config';
import express from 'express';
import {router} from './routes/index';
import {errorHandling} from './middleware/ErrorHandlingMiddleware';

const app = express();

const PORT = process.env.APP_PORT || 5000;

app.use('/api', router);
app.use(errorHandling);

const start = async () => {
  try {
      connect();
      app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
      console.log(e);
  }
}

start();