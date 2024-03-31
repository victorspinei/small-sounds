const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const path = require('path')
const fs = require('fs')

const utils = require('./utils.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res)=> {
	res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.get('/login', (req, res)=> {
	res.sendFile(path.join(__dirname, "./public/login.html"))
});

app.get('/signup', (req, res)=> {
	res.sendFile(path.join(__dirname, "./public/signup.html"))
});

app.post('/signup', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if (!utils.ValidateEmail(email)) {
        res.send("Invalid email <br> <a href=\"/signup\">Go Back!</a>");
    }
    if (password.length < 8) {
        res.send("Password too short<br> <a href=\"/signup\">Go Back!</a>");
    }
    

    res.redirect('/login');
});

app.listen(port, () => {
    console.log('http://localhost:3000/')
});