const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const path = require('path');

// Configuraciones y middlewares
app.use(express.json());
app.use(cors());

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/paseo-tel', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión a MongoDB establecida');
}).catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
});

// Manejo de errores de MongoDB
mongoose.connection.on('error', err => {
    console.error('Error de MongoDB:', err);
});

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/tickets', require('./routes/tickets'));
app.use('/redeem', require('./routes/redeem'));

// Servir archivos estáticos del cliente
app.use(express.static(path.join(__dirname, 'client/build')));

// Manejar todas las demás rutas para la aplicación React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Servidor HTTP y Socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Asignar io a la aplicación para acceder desde las rutas
app.set('io', io);

// Configuración de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    socket.on('error', (error) => {
        console.error('Error de Socket.io:', error);
    });

    socket.on('requestRedeem', (data) => {
        // Notificar a administrativos de una nueva solicitud
        io.emit('newRedeemRequest', data);
    });

    socket.on('confirmRedeem', (data) => {
        // Notificar al asistente que su canje fue confirmado
        io.emit('redeemConfirmed', data);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});