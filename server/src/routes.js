const express = require('express');
const path = require('path');
const utils = require('./utils.js');
const bcrypt = require('bcrypt');
const fs = require('fs');
const uploadImage = require('./upload.js');
const { body, validationResult } = require('express-validator');

const db = require('./database');

const router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.isLoggedIn && !req.cookies.loggedIn) {
        res.redirect('/login');
        return;
    }     
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "../public" ,"login.html"));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "signup.html"));
});

router.post('/signup', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('trap').isEmpty().withMessage('Extra input values are not allowed'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors.array().map(error => error.msg).join('<br>'));
    }
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

        // Check if username already exists
        if (rows.length !== 0) {
            res.send("Username already exists<br> <a href=\"/signup\">Go Back!</a>");
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.error('Error generating hash:', err.message);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                // Insert user into users table
                db.run('INSERT INTO users (username, email, hash, joined) VALUES (?, ?, ?, ?)', [username, email, hash, (new Date()).toDateString()], function(err) {
                    if (err) {
                        console.error('Error inserting data into users table:', err.message);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    // Get the user_id of the inserted user
                    const user_id = this.lastID;

                    // Insert profile for the user
                    db.run('INSERT INTO profile (user_id, markdown, picture) VALUES (?, ?, ?)', [user_id, `../media/users/${username}/README.md`, "/images/default_profile.png"], function(err) {
                        if (err) {
                            console.error('Error inserting data into profile table:', err.message);
                            res.status(500).send('Internal Server Error');

                            db.run('DELETE FROM users WHERE user_id = ?', user_id, (deletionError)=> {
                                console.log(deletionError);
                            });

                            return;
                        }

                        // Create user directory and README file
                        fs.mkdir(path.join(__dirname, `../media/users/${username}`), (error) => {
                            if (error) {
                                console.error('Error creating directory:', error.message);
                                res.status(500).send('Internal Server Error');
                                utils.removeFolderRecursive(path.join(__dirname, `../media/users/${username}`));
                                return;
                            } else {
                                const content = utils.GetContent(username);
                                fs.writeFileSync(path.join(__dirname, `../media/users/${username}/README.md`), content);
                                res.redirect('/login');
                            }
                        });
                    });
                });
            });
        }
    });
});

router.post('/login', [
    body('trap').isEmpty().withMessage('Extra input values are not allowed'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors.array().map(error => error.msg).join('<br>'));
    }
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
                        req.session.username = username;
                        res.cookie('loggedIn', true, {maxAge: 900000, httpOnly: true, secure: true });
                        res.cookie('username', username, {maxAge: 900000, httpOnly: true, secure: true });
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
    res.clearCookie('username');
    res.redirect('/login'); // Redirect to login page
});

router.get('/dashboard', (req, res) => {
    if (req.session.isLoggedIn || req.cookies.loggedIn) {
        // User is logged in
        // Proceed with rendering the dashboard
        const username = req.session.username;

        db.all('SELECT * FROM users WHERE username = ?', username, (err, user) => {
            if (err) {
                console.error('Error selecting data:', err.message);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (user.length === 0) {
                // User not found
                console.error('User not found');
                res.status(404).send('User not found');
                return;
            }

            db.all('SELECT * FROM profile WHERE user_id = ?', user[0].user_id, (er, profile) => {
                if (er) {
                    console.error('Error selecting data:', er.message);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                if (profile.length === 0) {
                    // Profile not found
                    console.error('Profile not found');
                    res.status(404).send('Profile not found');
                    return;
                }

                const song = profile[0].song ? profile[0].song : undefined;
                const src = profile[0].picture || "/image/default_profile.png";
                const content = fs.readFileSync(path.join(__dirname, profile[0].markdown), 'utf-8');

                res.render('dashboard', {username: username, src: src, content: content});
            });
        });

    } else {
        // User is not logged in
        // Redirect to login page or show an error message
        res.redirect('/login');
    }
});

router.get('/uploadProfilePicture', (req, res) => {
    if (!req.session.isLoggedIn && !req.cookies.loggedIn) {
        res.redirect('/login');
        return;
    }     
    res.sendFile(path.join(__dirname, "../public", "picture.html"));
});

router.post('/uploadProfilePicture', (req, res, next) => { if (!req.session.isLoggedIn && !req.cookies.loggedIn) {
        res.redirect('/login');
        return;
    }     
    const username = req.session.username;
    uploadImage(req, res, (uploadingError) => {
        if (uploadingError) {
            console.error('Error uploading image:', uploadingError.message);
            res.status(500).send('Internal Server Error');
            return;
        } 
        const filename = req.file.filename;
        db.all('SELECT * FROM users WHERE username = ?', username, (userError, user) => {
            if (userError) {
                console.error('Error selecting data:', userError.message);
                res.status(500).send('Internal Server Error');
                return;
            }
            db.all('SELECT * FROM profile WHERE user_id = ?', user[0].user_id, (selectingError, profile) => {
                if (selectingError) {
                    console.error('Error selecting data:', selectingError.message);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                if (profile[0].picture != "/images/default_profile.png") {
                    fs.unlink(path.join(__dirname, "../media/", profile[0].picture), (unlinkingError)=> {
                        if (unlinkingError) {
                            console.error('Error removing file:', unlinkingError);
                            return;
                        }
                        console.log('File removed successfully');
                    });
                }

            });
            db.run('UPDATE profile SET picture = ? WHERE user_id = ?', [`/images/${filename}`, user[0].user_id], (updatingError)=> {
                if (updatingError) {
                    console.error('Error updating data into profile table:', updatingError.message);
                    res.status(500).send('Internal Server Error');

                    fs.unlink(path.join(__dirname, "../media/images/", filename), (unlinkingError)=> {
                        if (unlinkingError) {
                            console.error('Error removing file:', unlinkingError);
                            return;
                        }
                        console.log('File removed successfully');
                    });

                    return;
                }
                res.redirect('/dashboard');
            })
        })
    });
});

router.get('/updateProfileReadme', (req, res) => {
    if (req.session.isLoggedIn || req.cookies.loggedIn) {
        // User is logged in
        // Proceed with rendering the dashboard
        const username = req.session.username;

        db.all('SELECT * FROM users WHERE username = ?', username, (err, user) => {
            if (err) {
                console.error('Error selecting data:', err.message);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (user.length === 0) {
                // User not found
                console.error('User not found');
                res.status(404).send('User not found');
                return;
            }

            db.all('SELECT * FROM profile WHERE user_id = ?', user[0].user_id, (er, profile) => {
                if (er) {
                    console.error('Error selecting data:', er.message);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                if (profile.length === 0) {
                    // Profile not found
                    console.error('Profile not found');
                    res.status(404).send('Profile not found');
                    return;
                }

                const content = fs.readFileSync(path.join(__dirname, profile[0].markdown), 'utf-8');

                res.render('markdown', { content: content });
            });
        });

    } else {
        // User is not logged in
        // Redirect to login page or show an error message
        res.redirect('/login');
    }
});

router.post('/updateProfileReadme', (req, res) => {
    if (req.session.isLoggedIn || req.cookies.loggedIn) {
        const content = req.body.readme;
        const username = req.session.username;
        fs.writeFileSync(path.join(__dirname, `../media/users/${username}/README.md`), content);
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

router.get('/post', (req, res) => {
    if (req.session.isLoggedIn || req.cookies.loggedIn) {
        res.sendFile(path.join(__dirname, "../public", "post.html"));
    } else {
        res.redirect('/login');
    }
});

module.exports = router;