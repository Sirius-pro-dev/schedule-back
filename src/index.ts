import express from 'express';

const app = express();

const PORT = process.env.APP_PORT || 5000;

app.get('/', (req, res) => {
  res.send('hello');
})

const start = async () => {
  try {
      app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
      console.log(e);
  }
}

start();