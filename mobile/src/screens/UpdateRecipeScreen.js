import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UpdateRecipeScreen = ({ route, navigation }) => {
    const { recipeId } = route.params;
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/recipes/${recipeId}`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                const data = response.data;
                setTitle(data.title);
                setDescription(data.description);
                setCategory(data.category);
                setIngredients(data.ingredients.join('\n'));
                setSteps(data.steps.join('\n'));
                setImage(data.image || '');
                setVideoUrl(data.videoUrl || '');
                setCalories(data.nutritionInfo?.calories?.toString() || '');
                setProtein(data.nutritionInfo?.protein?.toString() || '');
                setFat(data.nutritionInfo?.fat?.toString() || '');
            } catch (e) {
                console.log(e);
                alert('Gagal mengambil detail resep');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [recipeId]);

    const handleUpdate = async () => {
        if (!title || !description || !ingredients || !steps) {
            alert('Silakan isi semua kolom yang wajib diisi');
            return;
        }

        const recipeData = {
            title,
            description,
            category,
            ingredients: ingredients.split('\n').filter(item => item.trim() !== ''),
            steps: steps.split('\n').filter(item => item.trim() !== ''),
            image,
            videoUrl,
            nutritionInfo: {
                calories: Number(calories) || 0,
                protein: Number(protein) || 0,
                fat: Number(fat) || 0
            }
        };

        try {
            await axios.put(`${BASE_URL}/recipes/${recipeId}`, recipeData, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Resep berhasil diperbarui!');
            navigation.goBack();
        } catch (e) {
            console.log(e);
            alert('Gagal memperbarui resep');
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 50 }} />;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Nama Resep</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Nama Resep" />

            <Text style={styles.label}>Kategori</Text>
            <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Makanan, Minuman, dll" />

            <Text style={styles.label}>Deskripsi</Text>
            <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} multiline placeholder="Deskripsi resep" />

            <Text style={styles.label}>Bahan-bahan (Satu per baris)</Text>
            <TextInput style={[styles.input, { height: 100 }]} value={ingredients} onChangeText={setIngredients} multiline placeholder="Bahan-bahan" />

            <Text style={styles.label}>Langkah Pembuatan (Satu per baris)</Text>
            <TextInput style={[styles.input, { height: 100 }]} value={steps} onChangeText={setSteps} multiline placeholder="Langkah-langkah" />

            <Text style={styles.label}>URL Gambar</Text>
            <TextInput style={styles.input} value={image} onChangeText={setImage} placeholder="https://contoh.com/gambar.jpg" />

            <Text style={styles.label}>URL Video YouTube</Text>
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
                    <Text style={styles.label}>Fat (g)</Text>
                    <TextInput style={styles.input} value={fat} onChangeText={setFat} keyboardType="numeric" placeholder="0" />
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Perbarui Resep</Text>
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
        color: '#000',
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

export default UpdateRecipeScreen;
