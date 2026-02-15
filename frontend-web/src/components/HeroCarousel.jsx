import { useState, useEffect } from 'react';

const HeroCarousel = () => {
    const slides = [
        {
            url: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            text: 'Rahasia Lezat untuk Keluarga'
        },
        {
            url: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            text: 'Belajar Masak & Siap Jualan'
        },
        {
            url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            text: 'Inspirasi Menu Sehat Harian'
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div className='max-w-[1400px] h-[500px] w-full m-auto py-4 px-4 relative group'>
            <div
                style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
                className='w-full h-full rounded-2xl bg-center bg-cover duration-500 relative flex items-center justify-center transition-all'
            >
                <div className='bg-black/40 w-full h-full absolute rounded-2xl'></div>
                <h1 className='text-4xl md:text-6xl text-white font-bold relative z-10 text-center px-4 drop-shadow-2xl font-[Poppins]'>
                    {slides[currentIndex].text}
                </h1>
            </div>
            {/* Left Arrow */}
            <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-4xl text-white cursor-pointer hover:text-blue-500 transition drop-shadow-lg'>
                <button onClick={prevSlide} className='focus:outline-none'>❮</button>
            </div>
            {/* Right Arrow */}
            <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-4xl text-white cursor-pointer hover:text-blue-500 transition drop-shadow-lg'>
                <button onClick={nextSlide} className='focus:outline-none'>❯</button>
            </div>
        </div>
    );
};
export default HeroCarousel;
