import React from 'react';
import { FaCoffee, FaPizzaSlice, FaIceCream, FaHamburger, FaLeaf } from 'react-icons/fa';

const CategoryCarousel = ({ onSelectCategory }) => {
    const categories = [
        { name: 'Minuman', icon: <FaCoffee size={30} /> },
        { name: 'Makanan', icon: <FaPizzaSlice size={30} /> },
        { name: 'Dessert', icon: <FaIceCream size={30} /> },
        { name: 'Lunch', icon: <FaHamburger size={30} /> },
        { name: 'Vegan', icon: <FaLeaf size={30} /> },
    ];

    return (
        <div className='max-w-[1240px] mx-auto px-4 py-8 relative group'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6 font-[Poppins] text-center'>Kategori Pilihan</h2>

            <div className='flex flex-wrap justify-center gap-4 py-4 px-2'>
                {categories.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onSelectCategory && onSelectCategory(item.name)}
                        className='min-w-[120px] bg-white shadow-md rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300 border border-gray-200'
                    >
                        <div className='text-blue-500 mb-2'>
                            {item.icon}
                        </div>
                        <span className='font-medium text-gray-600'>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default CategoryCarousel;
