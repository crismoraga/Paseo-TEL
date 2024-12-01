const jwt = require('jsonwebtoken');
const User = require('../models/User');

function auth(role) {
    return async (req, res, next) => {
        // Obtener token de encabezados
        const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No hay token, autorización denegada' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id);

            if (role && req.user.role !== role) {
                return res.status(403).json({ message: 'Permiso denegado' });
            }

            next();
        } catch (err) {
            res.status(401).json({ message: 'Token no válido' });
        }
    };
}

module.exports = auth;