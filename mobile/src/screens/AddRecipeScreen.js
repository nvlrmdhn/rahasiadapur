import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddRecipeScreen = ({ navigation }) => {
    const { userToken, BASE_URL } = useContext(AuthContext);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Makanan');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [image, setImage] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');

    const handleSave = async () => {
        if (!title || !description || !ingredients || !steps) {
            alert('Silakan isi semua kolom yang wajib diisi');
            return;
        }

        const recipeData = {
            title,
            description,
            category,
            ingredients: ingredients.split('\n'),
            steps: steps.split('\n'),
            image,
            videoUrl,
            nutritionInfo: {
                calories: Number(calories) || 0,
                protein: Number(protein) || 0,
                fat: Number(fat) || 0
            }
        };

        try {
            await axios.post(`${BASE_URL}/recipes`, recipeData, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            navigation.goBack();
        } catch (e) {
            console.log(e);
            alert('Gagal menyimpan resep');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Nama Resep</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Contoh: Nasi Goreng Spesial" />

            <Text style={styles.label}>Kategori</Text>
            <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Makanan, Minuman, Penutup, dll" />

            <Text style={styles.label}>Deskripsi</Text>
            <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} multiline placeholder="Ceritakan sedikit tentang resep ini..." />

            <Text style={styles.label}>Bahan-bahan (Satu per baris)</Text>
            <TextInput style={[styles.input, { height: 100 }]} value={ingredients} onChangeText={setIngredients} multiline placeholder="Contoh: 2 siung bawang putih" />

            <Text style={styles.label}>Langkah Pembuatan (Satu per baris)</Text>
            <TextInput style={[styles.input, { height: 100 }]} value={steps} onChangeText={setSteps} multiline placeholder="Contoh: Haluskan bumbu..." />

            <Text style={styles.label}>URL Gambar (Opsional)</Text>
            <TextInput style={styles.input} value={image} onChangeText={setImage} placeholder="https://contoh.com/gambar.jpg" />

            <Text style={styles.label}>URL Video YouTube (Opsional)</Text>
            <TextInput style={styles.input} value={videoUrl} onChangeText={setVideoUrl} placeholder="https://www.youtube.com/watch?v=..." />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '31%' }}>
                    <Text style={styles.label}>Kalori</Text>
                    <TextInput style={styles.input} value={calories} onChangeText={setCalories} keyboardType="numeric" placeholder="0" />
                </View>
                <View style={{ width: '31%' }}>
                    <Text style={styles.label}>Protein (g)</Text>
                    <TextInput style={styles.input} value={protein} onChangeText={setProtein} keyboardType="numeric" placeholder="0" />
                </View>
                <View style={{ width: '31%' }}>
                    <Text style={styles.label}>Lemak (g)</Text>
                    <TextInput style={styles.input} value={fat} onChangeText={setFat} keyboardType="numeric" placeholder="0" />
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Simpan Resep</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#3B82F6',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AddRecipeScreen;
