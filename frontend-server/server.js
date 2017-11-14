const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require("fs");

const port = {
	base: false,
	secure: 3000
};

const options = {
    key: fs.readFileSync(path.resolve(__dirname, '..', 'encryption/simple-authorize-service.private.key'), 'utf8'),
    cert: fs.readFileSync(path.resolve(__dirname, '..', 'encryption/simple-authorize-service.certificate.crt'), 'utf8'),
    requestCert: true
};

app.use('/', express.static(path.join(__dirname, '../ui-util/dist')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

https.createServer(options, app).listen(port.secure, function() {
	console.log('Listen on port ' + 'https://localhost:' + port.secure);
});
