const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const fs = require('fs')


app.get('/', (req, res)=> {
	res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.get('/login', (req, res)=> {
	res.sendFile(path.join(__dirname, "./public/login.html"))
});

app.get('/signup', (req, res)=> {
	res.sendFile(path.join(__dirname, "./public/signup.html"))
});

app.listen(port, () => {
    console.log('http://localhost:3000/')
});