const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const bookRoutes = require('./routes/books');
const customerRoutes = require('./routes/customers');

const app = express();
app.use(bodyParser.json());

app.use('/books', bookRoutes);
app.use('/customers', customerRoutes);

app.get('/status', (req, res) => {
  res.set('Content-Type', 'text/plain').status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
