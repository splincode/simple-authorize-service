const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");
const https = require('https');
const router = express.Router();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dataWorker = require('./util/data-worker');
const path = require("path");

const databasePath = "db/db.json";
const port = {
    base: false,
    secure: 8080
};

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const privateKeySSL = fs.readFileSync(path.resolve(__dirname, '..', 'encryption/simple-authorize-service.private.key'), 'utf8');

const options = {
    key: privateKeySSL,
    cert: fs.readFileSync(path.resolve(__dirname, '..', 'encryption/simple-authorize-service.certificate.crt'), 'utf8'),
    requestCert: true
};

app.use(cookieParser());

app.use(session({
    secret: privateKeySSL,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000000000},
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.use('/login', function requiresLogin(req, res, next) {

    let db = dataWorker(databasePath);
    let user = db.users[(req.query.user || "").toLowerCase()] || {};
    let isSecure = false, exists = true;

    if (user.secure) {
        isSecure = true;
    }

    if (!user.hasOwnProperty("password")) {
    	exists = false;
    }

    let authenticate = user.active ? ((isSecure ? decrypt(user.password) : user.password) === req.query.password) : false;
    let userCurrent, userGroup, isFirst;

    if (authenticate) {
        userCurrent = req.session.username = req.query.user;
        userGroup = req.session.group = user.group;
        isFirst = user.first || false;
    } else {
        req.session.destroy();
    }

    res.jsonp({
        success: authenticate,
        data: {
        	username: userCurrent,
        	group: userGroup,
        	message: !authenticate ? "NOT_ALLOWED_OR_USER_BLOCKED" : undefined,
        	first: isFirst,
        	exists: exists,
            active: user.active
        }
    });

});

app.use('/logout', function (req, res) {
    req.session.destroy();
    res.jsonp({
        success: true,
        data: {}
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

router.get('/', function (req, res) {
    res.jsonp({success: true, message: "AUTHORIZED"});
});

router.get('/change-password', function (req, res) {

    
    let username = req.session.username;
    let password = req.query.password;
    let secure = (req.query.secure === "true");

    let db = dataWorker(databasePath);
    let user = db.users[username] || {};
    let success = false, isSecure = false;
    let typeError = "";
    let regexp = new RegExp(db.users[username].regexp || "", "i");

    if (user.secure) {
        isSecure = true;
    }

    let enableSecure = (secure);
    let currentPassword = (isSecure ? decrypt(user.password) : user.password);

	if (currentPassword !== password) {

        let valid = regexp.test(password);

        if (valid) {
            db.users[username].password = enableSecure ? encrypt(password) : password;
            db.users[username].secure = enableSecure;
            db.users[username].first = false;
            db.save();
            success = true;
        } else {
            typeError = "BAD_HINT";
        }
		
        
        
	} else {
        typeError = "NOT_SAVE";
    }

    res.jsonp({
        success: success,
        message: typeError,
        data: {
            regexp: db.users[username].regexp
        }
    });

});


router.get('/create-user', function (req, res) {
    let username = req.query.username;
    let password = req.query.password;
    let secure = (req.query.secure === "true");
    let group = (req.query.group) || "member";

    let db = dataWorker(databasePath);
    let success = false;

    if (secure) {
        password = encrypt(password);
    }

    if (!(db.users[username] || {}).hasOwnProperty("password")) {
        success = true;
        db.users[username] = {};
        db.users[username].username = username.toLowerCase();
        db.users[username].password = password;
        db.users[username].first = true;
        db.users[username].active = true;
        db.users[username].secure = secure;
        db.users[username].group = group;
        db.users[username].regexp = "";
        db.save();
    }

    res.jsonp({
        success: success,
        data: {
        }
    });

});


router.get('/user-info', function (req, res) {
    let username = req.query.username;
    let db = dataWorker(databasePath);

    res.jsonp({
        success: true,
        data: {
            info: db.users[username]
        }
    });

});


router.get('/password-constraint', function (req, res) {
    let username = req.query.username;
    let regexp = req.query.regexp;
    let db = dataWorker(databasePath);

    db.users[username].regexp = decodeURIComponent(regexp.trim());
    db.users[username].first = true;
    db.save();

    res.jsonp({
        success: true,
        data: {
        }
    });

});


router.get('/remove-user', function (req, res) {
    let username = req.query.username;
    let db = dataWorker(databasePath);
    delete db.users[username];
    db.save();

    res.jsonp({
        success: true,
        data: {
        }
    });

});

router.get('/block-user', function (req, res) {
    let username = req.query.username;
    let db = dataWorker(databasePath);
    db.users[username].active = false;
    db.save();

    res.jsonp({
        success: true,
        data: {
        }
    });

});

router.get('/unblock-user', function (req, res) {
    let username = req.query.username;
    let db = dataWorker(databasePath);
    db.users[username].active = true;
    db.save();

    res.jsonp({
        success: true,
        data: {
        }
    });

});

router.get('/state', function (req, res) {
    res.jsonp({
        success: true,
        data: {
        	session: req.session
        }
    });
	
});

router.get('/create-user', function (req, res) {

    if (req.session.group === "owner") {

        let userName = (req.query.user || "").toLowerCase();
        let password = req.query.password;
        let group = req.query.group || "member";
        let secure = req.query.secure || false;

        if (userName && password) {

            let db = dataWorker(databasePath);
            let userSave = db.users[userName] || false;

            if (userSave) {

                res.jsonp({
                    success: false,
                    message: "USER_EXISTS"
                });

            } else {

                db.users[userName] = {
                    password: secure ? encrypt(password) : password,
                    group: group,
                    secure: secure,
                    first: true
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

router.route('/users').get(function (req, res) {
    
    let db = dataWorker(databasePath);
    res.jsonp({
        success: true,
        data: {
            users: db.users
        }
    });

});


router.route('/info-user').get(function (req, res) {
    
    let db = dataWorker(databasePath);
    let userName = (req.query.username || "").toLowerCase();

    res.jsonp({
        success: true,
        data: {
            users: db.users
        }
    });

});


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


https.createServer(options, app).listen(port.secure, function () {
    console.log('Listen on port ' + 'https://localhost:' + port.secure);
});


function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, privateKeySSL);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, privateKeySSL);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}