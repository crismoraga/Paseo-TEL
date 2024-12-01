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
    MenuItem,
    CircularProgress
} from '@mui/material';

function Register(props) {
    const { authData } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [dietType, setDietType] = useState('omnívora');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(
                '/auth/register',
                { name, dietType },
                { headers: { Authorization: `Bearer ${authData.token}` } }
            );
            props.history.push('/assistant');
        } catch (err) {
            setError(err.response.data.message || 'Error al completar el registro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Completar Perfil
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleRegister} style={{ width: '100%', marginTop: '1em' }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        select
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Tipo de Dieta"
                        value={dietType}
                        onChange={(e) => setDietType(e.target.value)}
                    >
                        <MenuItem value="vegetariana">Vegetariana</MenuItem>
                        <MenuItem value="vegana">Vegana</MenuItem>
                        <MenuItem value="omnívora">Omnívora</MenuItem>
                    </TextField>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        style={{ marginTop: '1em' }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Guardar'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Register;