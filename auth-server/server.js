const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");
const databasePath = "db/db.json";

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
const router = express.Router();

router.get('/', function (req, res) {
    res.jsonp({message: 'welcome to our api!'});
});

router.route('/people').get(function (req, res) {
    let peopleResult = [];
    let data = JSON.parse(fs.readFileSync(databasePath, 'utf8')) || {people: []};
    data.people.forEach(person => peopleResult.push(Object.keys(person)[0]));
    res.jsonp({message: peopleResult});
});


app.use('/api', router);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(port);
console.log('Listen on port ' + 'http://localhost:' + port);
