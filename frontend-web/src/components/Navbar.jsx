import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [nav, setNav] = useState(false);

    const handleClick = () => setNav(!nav);

    return (
        <div className='fixed w-full h-[80px] flex justify-between items-center px-4 bg-white shadow-md z-50'>
            <div>
                <Link to="/" className='text-2xl font-bold text-blue-600 font-[Poppins]'>Rahasia Dapur</Link>
            </div>

            {/* Menu */}
            <ul className='hidden md:flex gap-8 font-medium text-gray-700'>
                <li><Link to="/" className='hover:text-blue-600 transition'>Home</Link></li>
                <li><Link to="/recipes" className='hover:text-blue-600 transition'>Recipe</Link></li>
                {user && (
                    <li><Link to="/my-recipes" className='hover:text-blue-600 transition'>My Recipe</Link></li>
                )}
            </ul>

            {/* Auth Button */}
            <div className='hidden md:flex'>
                {user ? (
                    <div className='flex items-center gap-4'>
                        <span className='font-semibold text-gray-700'>{user.name}</span>
                        <button onClick={logout} className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition'>Logout</button>
                    </div>
                ) : (
                    <Link to="/login" className='bg-blue-500 !text-white px-6 py-2 rounded-md hover:bg-blue-600 transition font-semibold'>
                        Login
                    </Link>
                )}
            </div>

            {/* Hamburger */}
            <div onClick={handleClick} className='md:hidden z-10 cursor-pointer text-gray-700'>
                {!nav ? <FaBars size={25} /> : <FaTimes size={25} />}
            </div>

            {/* Mobile Menu */}
            <ul className={!nav ? 'hidden' : 'absolute top-0 left-0 w-full h-screen bg-white flex flex-col justify-center items-center gap-8 text-2xl font-medium text-gray-700'}>
                <li><Link onClick={handleClick} to="/">Home</Link></li>
                <li><Link onClick={handleClick} to="/recipes">Recipe</Link></li>
                {user && <li><Link onClick={handleClick} to="/my-recipes">My Recipe</Link></li>}
                <li>
                    {user ? (
                        <button onClick={() => { logout(); handleClick(); }} className='text-red-500'>Logout</button>
                    ) : (
                        <Link onClick={handleClick} to="/login" className='text-blue-500'>Login</Link>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default Navbar;
