import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import AssistantDashboard from './components/AssistantDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <PrivateRoute path="/register" roles={['asistente']} component={Register} />
                        <PrivateRoute path="/admin" roles={['admin']} component={AdminDashboard} />
                        <PrivateRoute path="/assistant" roles={['asistente']} component={AssistantDashboard} />
                    </Switch>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;