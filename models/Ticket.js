const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    qrCode: { type: String, unique: true, required: true },
    valid: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scanned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);