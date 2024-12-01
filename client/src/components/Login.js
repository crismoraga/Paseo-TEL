import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
    Container,
    TextField,
    Button,
    Typography,
    Alert,
    Box,
    CircularProgress
} from '@mui/material';

function Login(props) {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/auth/login', { username, password });
            login(res.data);
            if (res.data.user.role === 'admin') {
                props.history.push('/admin');
            } else {
                props.history.push('/assistant');
            }
        } catch (err) {
            setError(err.response.data.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Iniciar Sesión
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleLogin} style={{ width: '100%', marginTop: '1em' }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        style={{ marginTop: '1em' }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Ingresar'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Login;