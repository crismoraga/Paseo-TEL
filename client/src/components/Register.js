import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Register(props) {
    const { authData } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [dietType, setDietType] = useState('omnívora');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                '/auth/register',
                { name, dietType },
                { headers: { Authorization: `Bearer ${authData.token}` } }
            );
            props.history.push('/assistant');
        } catch (err) {
            setError(err.response.data.message || 'Error al completar el registro');
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleRegister}>
                <h2>Completar Perfil</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <select value={dietType} onChange={(e) => setDietType(e.target.value)}>
                    <option value="vegetariana">Vegetariana</option>
                    <option value="vegana">Vegana</option>
                    <option value="omnívora">Omnívora</option>
                </select>
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
}

export default Register;