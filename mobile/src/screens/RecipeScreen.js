import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RecipeScreen = ({ navigation }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { BASE_URL } = useContext(AuthContext);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            let url = `${BASE_URL}/recipes`;
            if (search) url += `?keyword=${search}`;
            const response = await axios.get(url);
            setRecipes(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/150';
        if (imagePath.startsWith('http')) return imagePath;
        // Backend returns relative path like "uploads\\image.jpg" or "uploads/image.jpg"
        const cleanPath = imagePath.replace(/\\/g, '/');
        // Remove 'api' from BASE_URL to get root URL
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
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.user}>By {item.user?.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari resep..."
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={fetchRecipes}
                />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#3B82F6" />
            ) : (
                <FlatList
                    data={recipes}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                    onRefresh={fetchRecipes}
                    refreshing={loading}
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
    searchContainer: {
        padding: 10,
        backgroundColor: '#fff',
    },
    searchInput: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
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
    user: {
        fontSize: 12,
        color: '#666',
    },
});

export default RecipeScreen;
