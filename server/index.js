const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const app = express();
const port = 3000;
app.use(cookieParser())
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}))

const bcrypt = require('bcrypt')
const saltRounds = 10;

const bodyParser = require('body-parser');

const path = require('path')
const fs = require('fs')

const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database(path.join(__dirname, "./server.db"), (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
})

const utils = require('./utils.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/login.html"));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/signup.html"));
});

app.post('/signup', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const trap = req.body.trap;

    if (trap !== '') {
        res.send("Extra input values <br> <a href=\"/signup\">Go Back!</a>");
        return;
    }
    if (!utils.ValidateEmail(email)) {
        res.send("Invalid email <br> <a href=\"/signup\">Go Back!</a>");
        return;
    }
    if (password.length < 8) {
        res.send("Password too short<br> <a href=\"/signup\">Go Back!</a>");
        return;
    }
    db.all('SELECT * FROM users WHERE username = ?', username, (err, rows) => {
        if (err) {
            console.error('Error selecting data:', err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Check if any rows were returned
        if (rows.length !== 0) {
            res.send("Username already exists<br> <a href=\"/signup\">Go Back!</a>");
        } else {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.error('Error generating hash:', err.message);
                    res.status(500).send('Internal Server Error');
                    return;
                } else {
                    db.run('INSERT INTO users (username, email, hash, joined) VALUES (?, ?, ?, ?)', [username, email, hash, (new Date()).toDateString()], (err) => {
                        if(err) {
                            console.error('Error inserting data:', err.message);
                            res.status(500).send('Internal Server Error');
                            return;
                        }
                        console.log('User registered successfully');
                        res.redirect('/login')
                    });
                }
            });
        }
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const trap = req.body.trap;

    if (trap !== '') {
        res.send("Extra input values <br> <a href=\"/signup\">Go Back!</a>");
        return;
    }
    db.all('SELECT * FROM users WHERE username = ?', username, (err, rows) => {
        if (err) {
            console.error('Error selecting data:', err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Check if any rows were returned
        if (rows.length === 0) {
            res.send("Username not found<br> <a href=\"/login\">Go Back!</a>");
            return;
        } else {
            bcrypt.compare(password, rows[0].hash, (err, result)=> {
                if (err) {
                    console.log('Error comparing passwords:', err.message);
                } else {
                    if (result) {
                        req.session.isLoggedIn = true;
                        res.cookie('loggedIn', true, {maxAge: 900000, httpOnly: true });
                        res.redirect('/')
                    } else {
                        res.send("Passwords do not match<br> <a href=\"/login\">Go Back!</a>");
                        return;
                    }
                }
            });
        }
    });

});

app.get('/logout', (req, res) => {
    // Clear session
    req.session.destroy();
    // Clear login cookie
    res.clearCookie('loggedIn');
    res.redirect('/login'); // Redirect to login page
});

app.get('/example', (req, res) => {
    if (req.session.isLoggedIn || req.cookies.loggedIn) {
        // User is logged in
        // Proceed with rendering the dashboard
        res.render('example');
    } else {
        // User is not logged in
        // Redirect to login page or show an error message
        res.redirect('/login');
    }
});


app.listen(port, () => {
    console.log('http://localhost:3000/')
});
