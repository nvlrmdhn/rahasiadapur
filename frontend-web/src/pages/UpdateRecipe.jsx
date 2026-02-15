import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const UpdateRecipe = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

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
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`http://localhost:5000/api/recipes/${id}`, config);
                // Robust ownership check
                const ownerId = data.user?._id || data.user;
                if (ownerId !== user?._id) {
                    setError('Unauthorized');
                    return;
                }
                setTitle(data.title);
                setDescription(data.description);
                setCategory(data.category);
                setIngredients(data.ingredients.join('\n'));
                setSteps(data.steps.join('\n'));
                setVideoUrl(data.videoUrl);
                setImage(data.image);
                setCalories(data.nutritionInfo.calories);
                setProtein(data.nutritionInfo.protein);
                setFat(data.nutritionInfo.fat);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch recipe');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            };

            const updatedRecipe = {
                title,
                description,
                category,
                ingredients: ingredients.split('\n').filter(item => item.trim() !== ''),
                steps: steps.split('\n').filter(item => item.trim() !== ''),
                videoUrl,
                image,
                nutritionInfo: {
                    calories: Number(calories),
                    protein: Number(protein),
                    fat: Number(fat)
                }
            };

            await axios.put(`http://localhost:5000/api/recipes/${id}`, updatedRecipe, config);
            navigate(`/recipes/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return <div className='text-center py-20'>Loading...</div>;
    if (error) return <div className='text-center py-20 text-red-500 font-bold'>{error}</div>;

    return (
        <div className='max-w-[800px] mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-8 text-center font-[Poppins]'>Update Resep</h1>
            <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-md border border-gray-200'>
                <div className='mb-4'>
                    <label className='block text-gray-700 font-bold mb-2'>Nama Resep</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='w-full border p-2 rounded font-normal focus:outline-none focus:ring-2 focus:ring-blue-500' required />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 font-bold mb-2'>Kategori</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full border p-2 rounded font-normal focus:outline-none focus:ring-2 focus:ring-blue-500'>
                        <option value="Makanan">Makanan</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Vegan">Vegan</option>
                    </select>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 font-bold mb-2'>Deskripsi</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full border p-2 rounded font-normal h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar' required></textarea>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 font-bold mb-2'>Bahan-bahan (Satu per baris)</label>
                    <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} className='w-full border p-2 rounded font-normal h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar' required></textarea>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 font-bold mb-2'>Langkah Pembuatan (Satu per baris)</label>
                    <textarea value={steps} onChange={(e) => setSteps(e.target.value)} className='w-full border p-2 rounded font-normal h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar' required></textarea>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                        <label className='block text-gray-700 font-bold mb-2'>URL Gambar</label>
                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className='w-full border p-2 rounded font-normal focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                    <div>
                        <label className='block text-gray-700 font-bold mb-2'>Video URL (YouTube)</label>
                        <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className='w-full border p-2 rounded font-normal focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                </div>
                <label className='block text-gray-700 font-bold mb-2'>Informasi Nutrisi (Per porsi)</label>
                <div className='grid grid-cols-3 gap-4 mb-6'>
                    <div>
                        <label className='block text-sm text-gray-600 mb-1'>Kalori</label>
                        <input
                            type="number"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            className='w-full border p-2 rounded-md font-normal focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div>
                        <label className='block text-sm text-gray-600 mb-1'>Protein (g)</label>
                        <input
                            type="number"
                            value={protein}
                            onChange={(e) => setProtein(e.target.value)}
                            className='w-full border p-2 rounded-md font-normal focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div>
                        <label className='block text-sm text-gray-600 mb-1'>Lemak (g)</label>
                        <input
                            type="number"
                            value={fat}
                            onChange={(e) => setFat(e.target.value)}
                            className='w-full border p-2 rounded-md font-normal focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                </div>
                <button type="submit" className='w-full bg-blue-600 !text-white font-semibold py-3 rounded hover:bg-blue-700 transition'>Update Resep</button>
            </form>
        </div>
    );
};

export default UpdateRecipe;
