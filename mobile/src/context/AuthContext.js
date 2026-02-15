import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    // For production:
    const BASE_URL = 'https://rahasiadapur.onrender.com/api';

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                email,
                password
            });

            const userInfo = response.data;
            setUserInfo(userInfo);
            setUserToken(userInfo.token);

            await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            await AsyncStorage.setItem('userToken', userInfo.token);

        } catch (e) {
            console.log(`Login error ${e}`);
            alert('Login failed. Check your internet connection or credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUserInfo(null);
        await AsyncStorage.removeItem('userInfo');
        await AsyncStorage.removeItem('userToken');
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userInfo = await AsyncStorage.getItem('userInfo');
            let userToken = await AsyncStorage.getItem('userToken');

            if (userInfo) {
                setUserToken(userToken);
                setUserInfo(JSON.parse(userInfo));
            }

            setIsLoading(false);
        } catch (e) {
            console.log(`isLogged in error ${e}`);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{
            login,
            logout,
            isLoading,
            userToken,
            userInfo,
            BASE_URL
        }}>
            {children}
        </AuthContext.Provider>
    );
};
