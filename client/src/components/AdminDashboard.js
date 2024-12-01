import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

function AdminDashboard() {
    const { authData } = useContext(AuthContext);
    const [redeemRequests, setRedeemRequests] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [qrCode, setQrCode] = useState('');
    const socket = socketIOClient('/');

    useEffect(() => {
        socket.on('newRedeemRequest', (data) => {
            setRedeemRequests((requests) => [...requests, data]);
        });

        return () => socket.disconnect();
    }, []);

    const handleGenerateTicket = async (e) => {
        e.preventDefault();
        const res = await axios.post(
            '/tickets/generate',
            { username, password },
            { headers: { Authorization: `Bearer ${authData.token}` } }
        );
        setQrCode(res.data.qrCode);
    };

    const handleConfirm = async (request) => {
        await axios.post(
            '/redeem/confirm',
            { userId: request.userId, type: request.type },
            { headers: { Authorization: `Bearer ${authData.token}` } }
        );
        socket.emit('confirmRedeem', request);
        setRedeemRequests(redeemRequests.filter((r) => r !== request));
    };

    return (
        <div className="admin-dashboard">
            <h2>Panel Administrativo</h2>
            <div className="generate-ticket">
                <h3>Generar Entrada</h3>
                <form onSubmit={handleGenerateTicket}>
                    <input
                        type="text"
                        placeholder="Usuario del asistente"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Generar</button>
                </form>
                {qrCode && (
                    <div>
                        <h4>Código QR Generado:</h4>
                        <img src={qrCode} alt="Código QR" />
                    </div>
                )}
            </div>
            <div className="redeem-requests">
                <h3>Solicitudes de Canje</h3>
                {redeemRequests.map((request, index) => (
                    <div key={index} className="request-item">
                        <p>Usuario ID: {request.userId}</p>
                        <p>Tipo: {request.type}</p>
                        <button onClick={() => handleConfirm(request)}>Confirmar</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;