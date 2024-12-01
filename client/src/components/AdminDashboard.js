import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import {
    Container,
    TextField,
    Button,
    Typography,
    Alert,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

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
        <Container maxWidth="md">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>
                    Panel Administrativo
                </Typography>
                <Box mt={3}>
                    <Typography variant="h6">Generar Entrada</Typography>
                    <form onSubmit={handleGenerateTicket}>
                        <TextField
                            label="Usuario del asistente"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Generar
                        </Button>
                    </form>
                    {qrCode && (
                        <Box mt={2}>
                            <Typography variant="h6">Código QR Generado:</Typography>
                            <img src={qrCode} alt="Código QR" />
                        </Box>
                    )}
                </Box>
                <Box mt={5}>
                    <Typography variant="h6">Solicitudes de Canje</Typography>
                    {redeemRequests.length === 0 ? (
                        <Alert severity="info">No hay solicitudes pendientes</Alert>
                    ) : (
                        <Paper>
                            <List>
                                {redeemRequests.map((request, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={`Usuario ID: ${request.userId}`}
                                            secondary={`Tipo: ${request.type}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                color="primary"
                                                onClick={() => handleConfirm(request)}
                                            >
                                                <CheckIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Container>
    );
}

export default AdminDashboard;