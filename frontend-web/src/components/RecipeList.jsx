import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes, title = 'Resep Terbaru', fromMyRecipe }) => {
    return (
        <div className='max-w-[1240px] mx-auto px-4 py-8'>
            <h2 className='text-2xl font-bold text-gray-700 mb-6 font-[Poppins]'>{title}</h2>
            {recipes.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} fromMyRecipe={fromMyRecipe} />
                    ))}
                </div>
            ) : (
                <p className='text-center text-gray-500'>Belum ada resep.</p>
            )}
        </div>
    );
};
export default RecipeList;
