import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MyRecipeScreen = ({ navigation }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { BASE_URL, userInfo } = useContext(AuthContext);

    const fetchMyRecipes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/recipes`);
            // Client side filtering
            const myRecipes = response.data.filter(r => r.user?._id === userInfo._id);
            setRecipes(myRecipes);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch on focus
        const unsubscribe = navigation.addListener('focus', () => {
            fetchMyRecipes();
        });
        return unsubscribe;
    }, [navigation]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/150';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        const rootUrl = BASE_URL.replace('/api', '');
        return `${rootUrl}/${cleanPath}`;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RecipeDetail', { recipeId: item._id })}>
            <Image
                source={{ uri: getImageUrl(item.image) }}
                style={styles.image}
            />
            <View style={styles.cardContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.category}>{item.category}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('UpdateRecipe', { recipeId: item._id })}
                    >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Resep Saya</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddRecipe')}>
                    <Text style={styles.addButtonText}>+ Tambah</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#3B82F6" />
            ) : (
                <FlatList
                    data={recipes}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Anda belum memiliki resep.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    list: {
        padding: 10,
    },
    card: {
        backgroundColor: '#fff',
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
    },
    cardContent: {
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    category: {
        fontSize: 12,
        color: '#3B82F6',
        fontWeight: 'bold',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    editButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default MyRecipeScreen;
