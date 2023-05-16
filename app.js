const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const authRoutes = require('./routes/auth');
const app = express();

// Usamos el middleware para parsear el cuerpo de las peticiones.
app.use(express.json());

// Inicializamos Passport.
app.use(passport.initialize());

// Definimos la estrategia local de Passport.
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); } // Si hay un error, lo devolvemos.
            if (!user) { return done(null, false); } // Si el usuario no existe, devolvemos false.
            if (!user.comparePassword(password)) { return done(null, false); } // Si la contraseña no coincide, devolvemos false.
            return done(null, user); // Si todo va bien, devolvemos el usuario.
        });
    }
));

// Conectamos a la base de datos con Mongoose.
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

// Usamos nuestras rutas de autenticación.
app.use(authRoutes);

// Definimos la ruta raíz.
app.get('/', (req, res) => {
    res.send('Login & Register server');
});

// Iniciamos el servidor en el puerto 3000.
app.listen(3000, () => {
    console.log('Server started on port 3000');
    });