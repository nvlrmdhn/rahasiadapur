import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import YoutubePlayer from 'react-native-youtube-iframe';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const RecipeDetailScreen = ({ route }) => {
    const { recipeId } = route.params;
    const { BASE_URL, userToken } = useContext(AuthContext);
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const config = userToken ? {
                    headers: { Authorization: `Bearer ${userToken}` }
                } : {};
                const response = await axios.get(`${BASE_URL}/recipes/${recipeId}`, config);
                setRecipe(response.data);
                setUnauthorized(false);
            } catch (e) {
                console.log(e);
                if (e.response?.status === 401) {
                    setUnauthorized(true);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [recipeId]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/300';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        const rootUrl = BASE_URL.replace('/api', '');
        return `${rootUrl}/${cleanPath}`;
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) return <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 50 }} />;

    if (unauthorized || !userToken) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
                <View style={{ padding: 30, backgroundColor: '#eff6ff', borderRadius: 20, alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1e40af', marginBottom: 10 }}>Akses Terbatas</Text>
                    <Text style={{ textAlign: 'center', color: '#60a5fa', marginBottom: 20 }}>Silakan login untuk melihat detail resep rahasia ini.</Text>
                </View>
            </View>
        );
    }
    if (!recipe) return <Text style={{ textAlign: 'center', marginTop: 50 }}>Resep tidak ditemukan</Text>;

    const videoId = getYouTubeId(recipe.videoUrl);

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: getImageUrl(recipe.image) }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.title}>{recipe.title}</Text>
                <View style={styles.meta}>
                    <Text style={styles.category}>{recipe.category}</Text>
                    <Text style={styles.user}>Oleh <Text style={{ color: '#3B82F6', fontWeight: 'bold' }}>{recipe.user?.name}</Text></Text>
                </View>

                <View style={styles.nutritionBox}>
                    <Text style={styles.nutritionTitle}>Informasi Nutrisi</Text>
                    <View style={styles.nutritionGrid}>
                        <View style={styles.nutritionItem}>
                            <Text style={[styles.nutritionValue, { color: '#10b981' }]}>{recipe.nutritionInfo?.calories || 0}</Text>
                            <Text style={styles.nutritionLabel}>Kalori</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={[styles.nutritionValue, { color: '#ef4444' }]}>{recipe.nutritionInfo?.protein || 0}g</Text>
                            <Text style={styles.nutritionLabel}>Protein</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={[styles.nutritionValue, { color: '#f59e0b' }]}>{recipe.nutritionInfo?.fat || 0}g</Text>
                            <Text style={styles.nutritionLabel}>Lemak</Text>
                        </View>
                    </View>
                </View>

                {videoId && (
                    <View style={styles.videoContainer}>
                        <Text style={styles.sectionTitle}>Video Tutorial</Text>
                        <YoutubePlayer
                            height={220}
                            play={false}
                            videoId={videoId}
                        />
                    </View>
                )}

                <Text style={styles.sectionTitle}>Deskripsi</Text>
                <Text style={styles.text}>{recipe.description}</Text>

                <Text style={styles.sectionTitle}>Bahan-bahan</Text>
                {recipe.ingredients.map((item, index) => (
                    <Text key={index} style={styles.listItem}>• {item}</Text>
                ))}

                <Text style={styles.sectionTitle}>Langkah Pembuatan</Text>
                {recipe.steps.map((item, index) => (
                    <Text key={index} style={styles.listItem}>{index + 1}. {item}</Text>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    meta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    category: {
        color: '#3B82F6',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    user: {
        color: '#666',
    },
    nutritionBox: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 20,
    },
    nutritionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    nutritionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    nutritionItem: {
        alignItems: 'center',
    },
    nutritionValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    nutritionLabel: {
        fontSize: 12,
        color: '#666',
    },
    videoContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#3B82F6',
    },
    text: {
        lineHeight: 22,
        color: '#555',
    },
    listItem: {
        marginBottom: 5,
        lineHeight: 22,
        color: '#555',
    },
});

export default RecipeDetailScreen;
