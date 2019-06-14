const express = require('express');
// to use express router
const router = express.Router();
// for handling the pages without authentication
// work as a middleware
const { ensureAuthenticated } = require('../config/authenticate');

// Welcome Page
router.get('/', (req, res) => {
    res.render('welcome');
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    });
});


module.exports = router;
