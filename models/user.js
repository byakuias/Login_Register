const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definimos el esquema del usuario con username y password.
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Antes de guardar el usuario, encriptamos la contraseña.
UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

// Definimos un método para comparar contraseñas.
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Exportamos el modelo de usuario.
module.exports = mongoose.model('User', UserSchema);