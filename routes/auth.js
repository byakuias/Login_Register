const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Definimos la ruta de login con autenticación local.
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
});

// Definimos la ruta de registro. Creamos un nuevo usuario y lo guardamos en la base de datos.
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.redirect('/login');
});

// Middleware para proteger las rutas. Si el usuario no está autenticado, lo redirigimos a login.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

router.get('/protected', ensureAuthenticated, (req, res) => {
    res.send('Esta es una ruta protegida');
});

// Exportamos nuestras rutas.
module.exports = router;