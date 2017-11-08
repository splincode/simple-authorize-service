const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");
const https = require('https');
const router = express.Router();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dataWorker = require('./util/data-worker');
const databasePath = "db/db.json";
const port = {
    base: false,
    secure: 8080
};

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const privateKeySSL = fs.readFileSync('../encryption/simple-authorize-service.private.key', 'utf8');
const options = {
    key: privateKeySSL,
    cert: fs.readFileSync('../encryption/simple-authorize-service.certificate.crt', 'utf8'),
    requestCert: true
};

app.use(cookieParser());

app.use(session({
    secret: privateKeySSL,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000000000 },
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.use('/login', function requiresLogin(req, res, next) {

    let db = dataWorker(databasePath);
    let user = db.users[req.query.user] || {};
    let isSecure = false;

    if (user.secure) {
    	isSecure = true;
    }

    let authenticate = (isSecure ? decrypt(user.password) : user.password) === req.query.password;
    let userCurrent, userGroup;

    if (authenticate) {
    	userCurrent = req.session.username = req.query.user;
    	userGroup = req.session.group = user.group;
    } else {
    	req.session.destroy();
    }

    res.jsonp({
    	success: authenticate,
        username: userCurrent,
        group: userGroup,
        message: !authenticate ? "NOT_ALLOWED" : undefined
    });

});

app.use('/logout', function (req, res) {
  req.session.destroy();
  res.jsonp({
    	success: true,
        data: {
        }
    });
});

app.use('/api', function requiresLogin(req, res, next) {
    if (req.session && req.session.username) {
        return next();
    } else {
        res.jsonp({
            success: false,
            message: "NOT_AUTHORIZED",
            data: {}
        });
    }
}, router);

router.get('/', function(req, res) {
    res.jsonp({ message: "" });
});

router.get('/create-user', function(req, res) {

	if (req.session.group === "owner") {
		
		let userName = req.query.user;
		let password = req.query.password;
		let group = req.query.group || "member";
		let secure = req.query.secure || false;

		if (userName && password) {

			let db = dataWorker(databasePath);
			let userSave = db.users[userName] || false;
			console.log("userSave", userSave, typeof userSave)
			if (userSave) {
				
				res.jsonp({
					success: false,
				    message: "USER_EXISTS"
				});

			} else {

				db.users[userName] = {
					password: secure ? encrypt(password) : password,
					group: group,
					secure: secure
				};

				db.save();


				res.jsonp({
					success: true,
				    data: {
				    	user: userName,
				    	password: password
				    }
				});
			}


		} else {
			res.jsonp({
				success: false,
			    message: "EMPTY_LOGIN_PASSWORD"
			});
		}

	} else {
		res.jsonp({
			success: false,
		    message: "ACCESS_DENIED"
		});
	}
});

router.route('/people').get(function(req, res) {
    let peopleResult = [];
    let data = JSON.parse(fs.readFileSync(databasePath, 'utf8')) || {
        people: []
    };
    data.people.forEach(person => peopleResult.push(Object.keys(person)[0]));
    res.jsonp({
        message: peopleResult
    });
});


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


https.createServer(options, app).listen(port.secure, function() {
    console.log('Listen on port ' + 'https://localhost:' + port.secure);
});


function encrypt(text){
  var cipher = crypto.createCipher(algorithm, privateKeySSL);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm, privateKeySSL);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}