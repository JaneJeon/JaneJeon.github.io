// a small server to count visits to the blog
const app = require('express')()
const bodyParser = require('body-parser')
const session = require('express-session')
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('site.db')

// setup tables
db.run(`
CREATE TABLE IF NOT EXISTS Sessions (
	id CHARACTER(36) PRIMARY KEY, 
	ip VARCHAR(45)   NOT NULL
)`)
db.run(`
CREATE TABLE IF NOT EXISTS Visits (
	id        INTEGER       PRIMARY KEY,
	sessionID CHARACTER(36) NOT NULL,
	url       VARCHAR(80)   NOT NULL,
	referrer  VARCHAR(80),
	timestamp INTEGER       NOT NULL,
	FOREIGN KEY(sessionId) REFERENCES Sessions(id)
)`)
db.run(`
CREATE TABLE IF NOT EXISTS Clicks (
	id INTEGER PRIMARY KEY,
	sessionID CHARACTER(36) NOT NULL,
	url       VARCHAR(80)   NOT NULL,
	timestamp INTEGER       NOT NULL,
	FOREIGN KEY(sessionId) REFERENCES Sessions(id)
)`)

app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 3600
	}
}))

// allow POST requests
app.use(function(request, response, next) {
	response.header('Access-Control-Allow-Origin', request.headers.origin);
	response.header('Access-Control-Allow-Methods', 'POST')
	response.header('Access-Control-Allow-Headers', 'content-Type')
	response.header('Access-Control-Allow-Credentials', true)
	next()
})

// decode the JSON requests
app.use(bodyParser.json());

// record visit
app.post('/', (request, response) => {
	console.log(`request from ${request.ip} with session ${request.sessionID}`)
	
	// check if this session exists in the DB
	db.get('SELECT COUNT(*) FROM Sessions WHERE id = ?', request.sessionID, function(err, row) {
		if (err) {
			console.log(`error: ${err}`)
			response.end()
		}
		
		if (!row['COUNT(*)'])
			db.run('INSERT INTO Sessions VALUES (?, ?)', request.sessionID, request.ip)
	})
	
	if (request.body.type == 'visit')
		db.run('INSERT INTO Visits (sessionID, url, referrer, timestamp) VALUES (?, ?, ?, ?)',
			request.sessionID, request.body.url, request.body.prev, Date.now())
	else if (request.body.type == 'click')
		db.run('INSERT INTO Clicks (sessionID, url, timestamp) VALUES (?, ?, ?)',
			request.sessionID, request.body.url, Date.now())
	
	response.end()
})

app.listen(3000, (err) => {
	if (err) return console.log(`error: ${err}`)
	
	console.log('server is listening on port 3000!')
})