const express = require('express');
// to use express router
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/user');


// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Registration Page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all the fields' });
    }


    // Check password & passoword2 match
    if(password !== password2) {
        errors.push({ msg: 'Passwords are not same' });
    }

    // Check length of password
    if(password.length <  1) {
        errors.push({ msg: 'Password should be atleast 7 characters' });
    }

    // if any errors, the re-render the registration form
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // if validation is succesful, no errors
        User.findOne({ email: email})
        .then(user => {
            if(user) {
                // User already there in the db
                errors.push({ msg: 'Email is already register' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });        
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                // Encrypt the Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        // Set password to hash
                        newUser.password = hash;
                        // Save user 
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are successfully registered');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    })
                });
            }
        })
        .catch();
    }
    
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);    
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();  
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


module.exports = router;
