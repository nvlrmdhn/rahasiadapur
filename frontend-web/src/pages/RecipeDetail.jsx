import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const RecipeDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const config = user ? {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                } : {};

                const { data } = await axios.get(`http://localhost:5000/api/recipes/${id}`, config);
                setRecipe(data);
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    setError('Unauthorized');
                } else {
                    setError('Failed to fetch recipe');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id, user]);

    if (loading) return (
        <div className='flex justify-center items-center min-h-[60vh]'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
        </div>
    );

    if (error === 'Unauthorized' || (!user && error)) { // Added `&& error` to ensure it only shows if an error actually occurred and it's unauthorized or no user.
        return (
            <div className='max-w-[1240px] mx-auto px-4 py-20 text-center'>
                <div className='bg-blue-50 p-8 rounded-2xl shadow-sm border border-blue-100 inline-block'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-4 font-[Poppins]'>Akses Terbatas</h2>
                    <p className='text-gray-600 mb-6'>Silakan login untuk melihat detail resep rahasia ini.</p>
                    <Link to="/login" className='bg-blue-500 hover:bg-blue-600 !text-white px-8 py-3 rounded-md transition font-semibold'>
                        Login Sekarang
                    </Link>
                </div>
            </div>
        );
    }

    if (error) return <div className='text-center py-20 text-red-500 font-bold'>{error}</div>;
    if (!recipe) return <div className='text-center py-20'>Resep tidak ditemukan.</div>;

    return (
        <div className='max-w-[1240px] mx-auto px-4 py-8'>
            <h1 className='text-3xl md:text-5xl font-bold text-gray-800 mb-4 font-[Poppins]'>{recipe.title}</h1>
            <div className='flex items-center justify-between mb-8'>
                <div className='flex items-center text-gray-500'>
                    <span className='mr-4'>Oleh: <span className='font-semibold text-blue-600'>{recipe.user?.name}</span></span>
                    <span className='bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-bold'>{recipe.category}</span>
                </div>
                {/* Edit Button for Owner - Only if accessed from My Recipes */}
                {user && recipe.user && user._id === (recipe.user._id || recipe.user) && location.state?.fromMyRecipe && (
                    <Link to={`/update-recipe/${id}`} className='bg-blue-500 hover:bg-blue-600 !text-white px-4 py-2 rounded-md transition font-semibold'>
                        Update Resep
                    </Link>
                )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Left: Image */}
                <div>
                    <img
                        src={recipe.image ? (recipe.image.startsWith('http') ? recipe.image : `http://localhost:5000/${recipe.image.replace(/\\/g, '/')}`) : 'https://via.placeholder.com/600x400'}
                        alt={recipe.title}
                        className='w-full h-[400px] object-cover rounded-xl shadow-lg'
                    />
                </div>

                {/* Right: Nutrition & Desc */}
                <div>
                    <div className='bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-100'>
                        <h3 className='text-xl font-bold mb-4 border-b pb-2'>Nutrisi (per porsi)</h3>
                        <div className='grid grid-cols-3 gap-4 text-center'>
                            <div>
                                <p className='font-bold text-2xl text-green-500'>{recipe.nutritionInfo?.calories || 0}</p>
                                <p className='text-gray-500 text-sm'>Kalori</p>
                            </div>
                            <div>
                                <p className='font-bold text-2xl text-red-500'>{recipe.nutritionInfo?.protein || 0}g</p>
                                <p className='text-gray-500 text-sm'>Protein</p>
                            </div>
                            <div>
                                <p className='font-bold text-2xl text-yellow-500'>{recipe.nutritionInfo?.fat || 0}g</p>
                                <p className='text-gray-500 text-sm'>Lemak</p>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
                        <h3 className='text-xl font-bold mb-4 border-b pb-2'>Deskripsi</h3>
                        <p className='text-gray-600 leading-relaxed'>{recipe.description}</p>
                    </div>
                </div>
            </div>

            {/* Ingredients & Steps */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
                <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
                    <h3 className='text-xl font-bold mb-4 text-blue-600'>Bahan-bahan</h3>
                    <ul className='list-disc list-inside space-y-2 text-gray-700'>
                        {recipe.ingredients && recipe.ingredients.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
                    <h3 className='text-xl font-bold mb-4 text-blue-600'>Langkah Pembuatan</h3>
                    <ol className='list-decimal list-inside space-y-4 text-gray-700'>
                        {recipe.steps && recipe.steps.map((step, index) => (
                            <li key={index} className='pl-2'>
                                <span className='font-medium'>{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Video */}
            {recipe.videoUrl && (
                <div className='mt-8'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800'>Video Tutorial</h3>
                    <div className='w-full h-[400px] md:h-[500px] bg-black rounded-xl overflow-hidden'>
                        <iframe
                            width="100%"
                            height="100%"
                            src={recipe.videoUrl.replace("watch?v=", "embed/")}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};
export default RecipeDetail;
