const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, '../app-service/dist')));
app.listen(port);

console.log('Listen on port ' + 'http://localhost:' + port);