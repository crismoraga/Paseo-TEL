import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import AssistantDashboard from './components/AssistantDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <PrivateRoute path="/register" roles={['asistente']} component={Register} />
                    <PrivateRoute path="/admin" roles={['admin']} component={AdminDashboard} />
                    <PrivateRoute path="/assistant" roles={['asistente']} component={AssistantDashboard} />
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;