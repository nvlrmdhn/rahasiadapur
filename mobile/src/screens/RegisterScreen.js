import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { login, BASE_URL } = useContext(AuthContext);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Kata sandi tidak cocok");
            return;
        }
        try {
            await axios.post(`${BASE_URL}/auth/register`, {
                name,
                email,
                password
            });
            // Auto login after register
            login(email, password);
        } catch (e) {
            console.log(`Register error ${e}`);
            alert('Pendaftaran gagal');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3565/3565418.png' }}
                    style={styles.logo}
                />
                <Text style={styles.title}>Join Us</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nama Lengkap"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={text => setName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Kata Sandi"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Konfirmasi Kata Sandi"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Daftar</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                    <Text style={{ color: '#333' }}>Sudah punya akun? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.link}>Masuk</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    inputContainer: {},
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        color: '#333', // Ensure text is visible
    },
    button: {
        backgroundColor: '#3B82F6',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: '#3B82F6',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
