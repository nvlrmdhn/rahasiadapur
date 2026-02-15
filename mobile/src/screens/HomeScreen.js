import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
    const { logout, userInfo, BASE_URL } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLatestRecipes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/recipes`);
            setRecipes(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestRecipes();
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/150';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        const rootUrl = BASE_URL.replace('/api', '');
        return `${rootUrl}/${cleanPath}`;
    };

    const slides = [
        {
            url: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            text: 'Rahasia Lezat untuk Keluarga'
        },
        {
            url: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            text: 'Belajar Masak & Siap Jualan'
        },
        {
            url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            text: 'Inspirasi Menu Sehat Harian'
        }
    ];

    const renderCarouselItem = ({ item }) => (
        <View style={styles.carouselItem}>
            <Image source={{ uri: item.url }} style={styles.carouselImage} />
            <View style={styles.carouselOverlay}>
                <Text style={styles.carouselTitle}>{item.text}</Text>
            </View>
        </View>
    );

    const renderRecipeItem = ({ item }) => (
        <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => navigation.navigate('RecipeTab', { screen: 'RecipeDetail', params: { recipeId: item._id } })}
        >
            <Image source={{ uri: getImageUrl(item.image) }} style={styles.recipeImage} />
            <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeCategory}>{item.category}</Text>
                <Text style={styles.recipeUser}>Oleh {item.user?.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const Header = () => (
        <View>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Halo, {userInfo?.name}</Text>
                    <Text style={styles.subtext}>Mau masak apa hari ini?</Text>
                </View>
                <TouchableOpacity onPress={() => logout()}>
                    <Text style={styles.logoutText}>Keluar</Text>
                </TouchableOpacity>
            </View>

            {/* Carousel Section */}
            <View style={styles.carouselContainer}>
                <FlatList
                    data={slides}
                    renderItem={renderCarouselItem}
                    keyExtractor={(_, index) => `slide-${index}`}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <Text style={styles.sectionTitle}>Resep Terbaru</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <FlatList
                    data={recipes}
                    renderItem={renderRecipeItem}
                    keyExtractor={item => item._id}
                    ListHeaderComponent={Header}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={<Text style={styles.emptyText}>Belum ada resep.</Text>}
                    onRefresh={fetchLatestRecipes}
                    refreshing={loading}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    subtext: {
        fontSize: 14,
        color: '#666',
    },
    logoutText: {
        color: '#ef4444',
        fontWeight: 'bold',
    },
    carouselContainer: {
        height: 200,
        marginBottom: 20,
    },
    carouselItem: {
        width: Dimensions.get('window').width,
        height: 200,
        position: 'relative',
    },
    carouselImage: {
        width: '100%',
        height: '100%',
    },
    carouselOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
    },
    carouselTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    carouselCategory: {
        color: '#3B82F6',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 15,
        color: '#333',
    },
    listContainer: {
        paddingBottom: 20,
    },
    recipeCard: {
        flexDirection: 'row',
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    recipeImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    recipeInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    recipeCategory: {
        fontSize: 12,
        color: '#3B82F6',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    recipeUser: {
        fontSize: 12,
        color: '#999',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },
});

export default HomeScreen;
