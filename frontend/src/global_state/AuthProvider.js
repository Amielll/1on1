import axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // State to hold the authentication token
    const [token, _setToken] = useState(localStorage.getItem('token') || '');
    const [refresh, _setRefresh] = useState(localStorage.getItem('refresh') || '');

    const setToken = (token) => {
        if (token) {
            axios.defaults.headers.common.Authorization = 'Bearer ' + token;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common.Authorization;
            localStorage.removeItem('token');
        }
        _setToken(token);
    };

    const setRefresh = (refresh) => {
        if (refresh) {
            localStorage.setItem('refresh', refresh);
        } else {
            localStorage.removeItem('refresh');
        }
        _setRefresh(refresh);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!refresh) {
                clearInterval(interval);
                return;
            }
            refreshToken();
        }, 10 * 60 * 1000);

        return () => clearInterval(interval);
    }, [token, refresh]);

    const refreshToken = async () => {
        try {
            const res = await axios.post('/accounts/api/login/refresh', {
                refresh
            });
            setToken(res.data.access);
        } catch (error) {
            console.error(error);
            setToken('');
            setRefresh('');
        }
    };

    const authContext = useMemo(
        () => ({
            token,
            setToken,
            refresh,
            setRefresh
        }),
        [token]
    );

    return (
        <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
