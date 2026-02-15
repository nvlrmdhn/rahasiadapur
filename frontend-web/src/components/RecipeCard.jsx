import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, fromMyRecipe }) => {
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/300?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        // Adjust backslashes for Windows paths if needed, though browsers usually handle forward slash fine
        return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
    };

    return (
        <div className='bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition duration-300 border border-gray-100'>
            <img
                src={getImageUrl(recipe.image)}
                alt={recipe.title}
                className='w-full h-48 object-cover'
            />
            <div className='p-4'>
                <span className='bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full uppercase font-bold'>{recipe.category}</span>
                <h3 className='text-lg font-bold text-gray-800 mt-2 truncate font-[Poppins]'>{recipe.title}</h3>
                <p className='text-sm text-gray-500 mt-1'>Oleh: {recipe.user?.name || 'Chef'}</p>
                <Link
                    to={`/recipes/${recipe._id}`}
                    state={{ fromMyRecipe }}
                    className='block mt-4 text-center w-full bg-blue-500 hover:bg-blue-600 !text-white py-2 rounded-md transition font-semibold'
                >
                    Lihat Resep
                </Link>
            </div>
        </div>
    );
};
export default RecipeCard;
