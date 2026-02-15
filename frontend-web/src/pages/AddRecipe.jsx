import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const AddRecipe = () => {
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
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !ingredients || !steps) {
            setError('Please fill in all required fields');
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
                calories: Number(calories),
                protein: Number(protein),
                fat: Number(fat)
            }
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post('http://localhost:5000/api/recipes', recipeData, config);
            navigate('/my-recipes');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create recipe');
        }
    };

    return (
        <div className='max-w-[800px] mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-8 font-[Poppins] text-center'>Tambah Resep Baru</h1>

            {error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}

            <form onSubmit={handleSubmit} className='bg-white p-6 rounded-xl shadow-lg'>
                <div className='mb-4'>
                    <label className='block text-gray-700 font-bold mb-2'>Nama Resep*</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-full border p-2 rounded-md font-normal focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder="Contoh: Nasi Goreng Spesial"
                    />
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 font-bold mb-2'>Kategori*</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='w-full border p-2 rounded-md font-normal focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="Makanan">Makanan</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Vegan">Vegan</option>
                    </select>
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 font-bold mb-2'>Deskripsi*</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='w-full border p-2 rounded-md font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar h-24'
                        placeholder="Ceritakan sedikit tentang resep ini..."
                    ></textarea>
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 font-bold mb-2'>Bahan-bahan (Satu per baris)*</label>
                    <textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        className='w-full border p-2 rounded-md font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar h-40'
                        placeholder="1 piring nasi&#10;2 butir telur&#10;..."
                    ></textarea>
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 font-bold mb-2'>Langkah Pembuatan (Satu per baris)*</label>
                    <textarea
                        value={steps}
                        onChange={(e) => setSteps(e.target.value)}
                        className='w-full border p-2 rounded-md font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar h-40'
                        placeholder="1. Panaskan minyak&#10;2. Masukkan bumbu&#10;..."
                    ></textarea>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                        <label className='block text-gray-700 font-bold mb-2'>URL Gambar (Optional)</label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className='w-full border p-2 rounded-md font-normal focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div>
                        <label className='block text-gray-700 font-bold mb-2'>URL YouTube (Optional)</label>
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className='w-full border p-2 rounded-md font-normal focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder="https://youtube.com/watch?v=..."
                        />
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

                <button className='w-full py-3 bg-blue-500 hover:bg-blue-600 !text-white font-semibold rounded-md transition duration-300 transform hover:scale-[1.02]'>
                    Simpan Resep
                </button>
            </form>
        </div>
    );
};
export default AddRecipe;
