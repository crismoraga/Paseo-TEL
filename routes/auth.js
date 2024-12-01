const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Verificar existencia del usuario
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    // Verificar contraseña
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
});

// Ruta de registro para asistentes
router.post('/register', async (req, res) => {
    const { username, password, name, dietType } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

    // Crear nuevo usuario
    const user = new User({ username, password, role: 'asistente', name, dietType });
    await user.save();

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
});

module.exports = router;