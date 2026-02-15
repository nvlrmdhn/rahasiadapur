import { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeList from '../components/RecipeList';
import { FaSearch } from 'react-icons/fa';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = ['All', 'Minuman', 'Makanan', 'Dessert', 'Lunch', 'Vegan'];

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            let url = 'http://localhost:5000/api/recipes?';
            if (searchTerm) url += `keyword=${searchTerm}&`;
            if (selectedCategory && selectedCategory !== 'All') url += `category=${selectedCategory}`;

            const { data } = await axios.get(url);
            setRecipes(data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, [selectedCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRecipes();
    };

    return (
        <div className='max-w-[1240px] mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-6 font-[Poppins] text-center'>Temukan Resep</h1>

            {/* Search and Filter */}
            <div className='flex flex-col mb-8 gap-4'> {/* Stack Vertical */}
                {/* Search */}
                <form onSubmit={handleSearch} className='relative w-full'>
                    <input
                        type="text"
                        placeholder="Cari resep..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full border border-blue-300 p-3 pl-10 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-blue-900 placeholder-blue-400'
                    />
                    <FaSearch className='absolute left-3 top-4 text-blue-500' />
                </form>

                {/* Filter */}
                <div className='flex gap-2 overflow-x-auto scrollbar-hide w-full p-2'>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap transition border ${selectedCategory === cat || (cat === 'All' && selectedCategory === '') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className='text-center py-10'>Loading...</div>
            ) : (
                <RecipeList recipes={recipes} title="" />
            )}
        </div>
    );
};
export default Recipes;
