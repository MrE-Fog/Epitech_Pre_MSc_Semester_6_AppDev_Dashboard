var express = require('express');
const bycrypt = require('bcrypt');
var cors = require('cors')
const io = require('socket.io')();
const fetch = require('node-fetch');
var fs = require('fs');
var mysql = require('mysql');
var request = require('request');


const port = 8080
const socketPort = 8000;

var app = express();
app.use(express.json())
app.use(cors())
var registered = true;
var unregistered = false;

/*
** api numbers 
**
**/

// request('http://numbersapi.com/42/trivia', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       console.log(body)
//     }
// })

// Set up a whitelist and check against it:
// var whitelist = ['http://localhost:8080/','http://localhost:3000/', 'http://194.147.2.105/']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// // Then pass them to cors:
// app.use(cors(corsOptions));

io.listen(socketPort);

const CLIENT_ID = '700728181765832815';
const CLIENT_SECRET = 'ZGbJLJd7BxS3uAkLmfBW5sw9CriXfDV-';

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

var db;

fs.readFile('database.conf', 'utf8', (err, password) => {
    db = mysql.createConnection({
        host: "localhost",
        user: "greg",
        password: password,
        database: "dashboard"
    })

    db.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });
});

io.on('connection', (socket) => {
    var discordToken;

    socket.on('getAuthToken', async (code) => {
        const options = { method: 'POST' };
        let params = new URLSearchParams();
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('code', code);
        params.append('grant_type', 'authorization_code');
        params.append('scope', 'identify');
        params.append('redirect_uri', 'http://localhost:3000/');
        options.body = params;

        await fetch('https://discordapp.com/api/oauth2/token', options)
            .then(response => { return response.json(); })
            .then(r => {
                discordToken = r.access_token;
                console.log(discordToken)
                socket.emit('getAuthTokenResponse')
            })

            .catch(error => { console.log(`So... this just happen: ${error}`); });
    })

    socket.on('getUserInfo', async () => {
        // let params = new URLSearchParams();
        const options = { method: 'GET' };
        options.headers = {
            'Authorization': 'Bearer ' + discordToken
        };

        await fetch('http://discordapp.com/api/users/@me', options)
            .then(response => { return response.json(); })
            .then(r => {
                console.log(r)
                socket.emit('getUserInfoResponse', r)
            })

            .catch(error => { console.log(`So... this just happen: ${error}`); });
    })

    /**
     * 
     * 
     * socket pour connecter l'api numbers
     */
    /**
     * 
     * get Number Trivia
     */
     socket.on('getNumberTrivia', async (number)=>{
        await request(`http://numbersapi.com/${number}/trivia`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              socket.emit('NumberTrivia',body)
            }
        })
     })
    /**
     * 
     * get Number math
     */
     socket.on('getNumberMath', async (number)=>{
        await request(`http://numbersapi.com/${number}/math`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              socket.emit('NumberMath',body)
            }
        })
     })
    /**
     * 
     * get Number Trivia
     */
     socket.on('getNumberDate', async (Month, Day)=>{
        await request(`http://numbersapi.com/${Month}/${Day}/date`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              socket.emit('NumberDate',body)
              console.log(body);
            }
        })
     })

     socket.on("isRegistered",async (email, type) =>{
            let sql = 'SELECT user_email FROM Choose_services WHERE user_email = ? and name_service = ?'
            console.log(email)
            console.log(type)
            let query = db.query(sql, [email, type],(err, result) => {
                if(result.length > 0){
                    console.log("true")
                    console.log(result)
                    socket.emit("registered", registered);
                }
                else{
                    console.log("false")
                    console.log(result)
                    socket.emit("registered", unregistered);
                }
            })
            
})

     socket.on("register",(email, type)=>{
        const msg = { user_email: email, name_service: type  }
        let sql = 'INSERT INTO Choose_services SET ?';
        let query = db.query(sql, msg, (err, result) => {
            if (err) {
                res.status(500).send();
                throw err;
            } console.log('ligne ajoutée')
            socket.emit("registered", registered);
        })
        
     })

         
})


app.get('/', function (req, res) {
    res.json({ value: 'hello world' });
});

app.get('/users', (req, res) => {

    db.query("SELECT * FROM Users", function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
})

app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bycrypt.hash(req.body.password, 10)
        const user = { email: req.body.email, password: hashedPassword, username: req.body.username }
        let sql = 'INSERT INTO Users SET ?';
        let query = db.query(sql, user, (err, result) => {
            if (err) {
                res.status(500).send();
                throw err;
            } console.log('ligne ajoutée')
        })
        res.status(201).send();
    } catch{ res.status(500).send(); }
})

app.post('/users/login', async (req, res) => {
    console.log()
    console.log('db connection ...')
    let sql = `SELECT password FROM Users WHERE email = "${req.body.email}"`;
    let query = db.query(sql, async (err, result) => {
        if (err) {
            res.status(500).send();
            throw err;
        } else if (result == null) {
            res.status(400).send('cannot find user');
            console.log("connection failed")
        } else {
            try {
                if (await bycrypt.compare(req.body.password, result[0].password)) {
                    res.status(200).send()
                    console.log("connection successful")
                }
                else res.status(500)
            } catch  {
                console.log("fail");
                res.status(500).send()
                console.log("connection failed")
            }
        }
    })
    // if (user == null){
    //     return res.status(400).send('cannot find user')
    // }

})

app.get('/users/exists', async (req, res) => {
    try {
        var found = false;

        let sql = 'SELECT email FROM Users';
        let query = db.query(sql, (err, result) => {
            if (err) {
                res.status(500).send();
                throw err;
            } else {
                result.map((line) => { if (req.query.email == line.email) found = true })
                res.status(200);
                if (found) res.send('true')
                else res.send('false')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send();
    }
})

app.get('/users/exists', async (req, res) => {
    try {
        var found = false;

        let sql = 'SELECT email FROM Users';
        let query = db.query(sql, (err, result) => {
            if (err) {
                res.status(500).send();
                throw err;
            } else {
                result.map((line) => { if (req.query.email == line.email) found = true })
                res.status(200);
                if (found) res.send('true')
                else res.send('false')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send();
    }
})

app.get('/weather/currentweather', async (req, res) => {
    try {
        
        let sql = 'SELECT email FROM Users';
        let query = db.query(sql, (err, result) => {
            if (err) {
                res.status(500).send();
                throw err;
            } else {
                result.map((line) => { if (req.query.email == line.email) found = true })
                res.status(200);
                if (found) res.send('true')
                else res.send('false')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send();
    }
})

app.listen(port);
