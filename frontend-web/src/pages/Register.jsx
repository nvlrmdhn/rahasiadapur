import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Password tidak sama');
            return;
        }
        if (password.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Register failed');
        }
    };

    return (
        <div className='w-full h-screen flex'>
            {/* Left Side (Image) */}
            <div className='hidden md:flex w-1/2 h-full bg-cover bg-center' style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}>
                <div className='w-full h-full bg-black/40 flex items-center justify-center p-12'>
                    <div className='text-white text-center'>
                        <h1 className='text-4xl font-bold mb-4 font-[Poppins]'>Bergabunglah Bersama Kami</h1>
                        <p className='text-xl'>Bagikan resep rahasia dapurmu kepada dunia.</p>
                    </div>
                </div>
            </div>

            {/* Right Side (Form) */}
            <div className='w-full md:w-1/2 h-full flex flex-col justify-center items-center p-8 bg-gray-50'>
                <form onSubmit={handleSubmit} className='w-full max-w-[400px] bg-white p-8 rounded-lg shadow-lg'>
                    <div className='flex justify-center mb-6 md:hidden'>
                        <h1 className='text-2xl font-bold text-blue-600 font-[Poppins]'>Rahasia Dapur</h1>
                    </div>
                    <h2 className='text-3xl font-bold text-center text-gray-800 mb-8 font-[Poppins]'>Register</h2>
                    {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
                    <div className='flex flex-col mb-4'>
                        <label className='mb-2 font-medium text-gray-700'>Nama</label>
                        <input
                            className='border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-normal font-[Poppins]'
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex flex-col mb-4'>
                        <label className='mb-2 font-medium text-gray-700'>Email</label>
                        <input
                            className='border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-normal font-[Poppins]'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex flex-col mb-4 relative'>
                        <label className='mb-2 font-medium text-gray-700'>Password</label>
                        <input
                            className='border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-normal font-[Poppins]'
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-[42px] text-gray-500 hover:text-blue-600 bg-transparent border-0 p-0 focus:outline-none'
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    <div className='flex flex-col mb-6 relative'>
                        <label className='mb-2 font-medium text-gray-700'>Konfirmasi Password</label>
                        <input
                            className='border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-normal font-[Poppins]'
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className='absolute right-3 top-[42px] text-gray-500 hover:text-blue-600 bg-transparent border-0 p-0 focus:outline-none'
                        >
                            {showConfirmPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    <button className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-300 cursor-pointer'>
                        Register
                    </button>
                    <p className='mt-4 text-center text-gray-600'>
                        Sudah punya akun? <Link to="/login" className='text-blue-600 font-bold hover:underline'>Login disini</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
