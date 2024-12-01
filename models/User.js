const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'asistente'], required: true },
    name: { type: String },
    dietType: { type: String, enum: ['vegetariana', 'vegana', 'omnívora'] },
    beveragesRedeemed: { type: Number, default: 0 },
    foodRedeemed: { type: Number, default: 0 },
    maxBeverages: { type: Number, default: 4 },
    maxFood: { type: Number, default: 3 }
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);