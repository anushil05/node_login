const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Modal
const User = require('../models/user');

module.exports = function(passport) {

    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            
            // Match User from db for login
            User.findOne( {email: email })
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'The email is not registered'});
                    }

                    // Compare Password 
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        console.log(password + " " + user.password);
                        if(isMatch) {
                            console.log("yes");
                            return done(null, user);
                        } else {
                            console.log("no");
                            return(done, false, { message: 'Password is wrong' })
                        }
                    });
                })
                .catch(err => console.log(err));
        })
        
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

}

