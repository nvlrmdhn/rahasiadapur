import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import RecipeList from '../components/RecipeList';

const MyRecipe = () => {
    const { user } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyRecipes = async () => {
            if (!user) return;
            try {
                const { data } = await axios.get('http://localhost:5000/api/recipes');
                // Filter client side as discussed
                const myRecipes = data.filter(recipe => recipe.user?._id === user._id || recipe.user === user._id);
                setRecipes(myRecipes);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyRecipes();
    }, [user]);

    if (!user) {
        return <div className='text-center py-20'>Please login to view your recipes.</div>;
    }

    return (
        <div className='max-w-[1240px] mx-auto px-4 py-8'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold text-gray-800 font-[Poppins]'>Resep Saya</h1>
                <Link to="/add-recipe" className='bg-blue-600 hover:bg-blue-700 !text-white px-4 py-2 rounded-md font-semibold transition'>
                    + Tambah Resep
                </Link>
            </div>

            {loading ? (
                <div className='text-center py-10'>Loading...</div>
            ) : (
                <RecipeList recipes={recipes} title="" fromMyRecipe={true} />
            )}
        </div>
    );
};
export default MyRecipe;
