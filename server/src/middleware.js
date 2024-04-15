const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();

app.use(cookieParser());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('media'));

nunjucks.configure(path.join(__dirname, '../views'), {
    autoescape: true,
    express: app
});

app.set('view engine', 'nunjucks');

app.use(express.static(path.join(__dirname, '../public')));

module.exports = app;
