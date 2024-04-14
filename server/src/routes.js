const express = require('express');
const path = require('path')
const utils = require('./utils.js')
const bcrypt = require('bcrypt')
const fs = require('fs')

const db = require('./database');

const router = express.Router()

router.get('/', (req, res) => {
    if (!req.session.isLoggedIn && !req.cookies.loggedIn) {
        res.redirect('/login');
        return;
    }     
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
});

router.post('/signup', (req, res) => {
    // TODO: FIX ADDING TO THE SECOND TABLE
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
            bcrypt.hash(password, 10, (err, hash) => {
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
                    });
                    db.all('SELECT * FROM users WHERE username = ?', username, (err, user) => {
                        if (err) {
                            console.error('Error selecting data:', err.message);
                            res.status(500).send('Internal Server Error');
                            return;
                        } else {
                            db.run('INSERT INTO profile (user_id, markdown, picture) VALUES (?, ?, ?)', [user[0].user_id, path.join(__dirname, `../media/users/${user[0].username}/README.md`), path.join(__dirname, "../media/images/default_profile.png")], (err) => {
                                if (err) {
                                    console.error('Error inserting data:', err.message);
                                    res.status(500).send('Internal Server Error');
                                    return;
                                } else {
                                    fs.mkdir(path.join(__dirname, `../media/users/${user[0].username}`), (error) => {
                                        if (error) {
                                            console.error('Error creating directory:', error.message);
                                            res.status(500).send('Internal Server Error');
                                            return;
                                        } else {
                                            res.redirect('/login')
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {
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

router.get('/logout', (req, res) => {
    // Clear session
    req.session.destroy();
    // Clear login cookie
    res.clearCookie('loggedIn');
    res.redirect('/login'); // Redirect to login page
});

router.get('/example', (req, res) => {
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

module.exports = router;