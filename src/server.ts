import bodyParser from 'body-parser';
import express from 'express';
import updateSolPrice from './api/updateSolPrice';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/updateSolPrice', updateSolPrice);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
