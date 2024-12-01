const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');

// Generar ticket y código QR
router.post('/generate', auth('admin'), async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificar usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el usuario ya tiene un ticket
        const existingTicket = await Ticket.findOne({ user: user._id, scanned: false });
        if (existingTicket) {
            return res.status(400).json({ message: 'El usuario ya tiene un ticket activo' });
        }

        // Crear nuevo ticket
        const ticket = new Ticket({ user: user._id });
        await ticket.save();

        // Generar código QR con los datos del ticket
        const qrData = {
            ticketId: ticket._id,
            userId: user._id,
            username: user.username
        };
        
        const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
        res.json({ qrCode });
    } catch (error) {
        console.error('Error al generar ticket:', error);
        res.status(500).json({ message: 'Error al generar ticket' });
    }
});

// Verificar ticket
router.post('/verify', auth('admin'), async (req, res) => {
    try {
        const { ticketId } = req.body;
        const ticket = await Ticket.findById(ticketId).populate('user');
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket no encontrado' });
        }
        
        if (ticket.scanned) {
            return res.status(400).json({ message: 'Ticket ya fue utilizado' });
        }

        ticket.scanned = true;
        await ticket.save();
        
        res.json({ message: 'Ticket verificado exitosamente', user: ticket.user });
    } catch (error) {
        console.error('Error al verificar ticket:', error);
        res.status(500).json({ message: 'Error al verificar ticket' });
    }
});

module.exports = router;
