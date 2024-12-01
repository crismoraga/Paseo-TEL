const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Solicitar canje de comida o bebida
router.post('/request', auth(), async (req, res) => {
    const { type } = req.body; // 'food' o 'beverage'
    const user = await User.findById(req.user._id);

    // Validar tipo y límites
    if (type === 'food' && user.foodRedeemed < user.maxFood) {
        // Notificar a administrativos mediante Socket.io
        req.app.io.emit('newRedeemRequest', { userId: user._id, type });
        res.json({ message: 'Solicitud de comida enviada' });
    } else if (type === 'beverage' && user.beveragesRedeemed < user.maxBeverages) {
        req.app.io.emit('newRedeemRequest', { userId: user._id, type });
        res.json({ message: 'Solicitud de bebida enviada' });
    } else {
        res.status(400).json({ message: 'Límite de canjes alcanzado' });
    }
});

// Confirmar canje por parte del administrativo
router.post('/confirm', auth('admin'), async (req, res) => {
    const { userId, type } = req.body;
    const user = await User.findById(userId);

    // Actualizar canjes realizados
    if (type === 'food') {
        user.foodRedeemed += 1;
    } else if (type === 'beverage') {
        user.beveragesRedeemed += 1;
    }

    await user.save();

    // Notificar al asistente mediante Socket.io
    req.app.io.emit('redeemConfirmed', { userId: user._id, type });

    res.json({ message: 'Canje confirmado' });
});

module.exports = router;