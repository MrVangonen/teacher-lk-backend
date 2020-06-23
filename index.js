var express = require('express');
const PORT = process.env.PORT || 5000;

var app = express();

app
  .get('/', (req, res) => res.send('Hi'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));