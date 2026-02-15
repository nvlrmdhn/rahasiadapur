import { useEffect, useState } from 'react';
import axios from 'axios';
import HeroCarousel from '../components/HeroCarousel';
import CategoryCarousel from '../components/CategoryCarousel';
import RecipeList from '../components/RecipeList';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/recipes');
                setRecipes(data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const handleCategorySelect = async (category) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/recipes?category=${category}`);
            setRecipes(data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <HeroCarousel />
            <CategoryCarousel onSelectCategory={handleCategorySelect} />
            {loading ? (
                <div className='text-center py-10'>Loading...</div>
            ) : (
                <RecipeList recipes={recipes} />
            )}
        </div>
    );
};
export default Home;
