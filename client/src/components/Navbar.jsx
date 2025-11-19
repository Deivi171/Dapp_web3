import { useState, useContext } from 'react';
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import { BsSun, BsMoon } from 'react-icons/bs';

import logo from '../../images/logo.png';
import { ThemeContext } from '../context/ThemeContext';


const NavbarItem = ({ title, classProps }) => {
    return (
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            {title}
        </li>
    );
}

const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    return (
        <nav className='w-full flex md:justify-center justify-between items-center p-4'>
            <div className='md:flex-[0.5] flex-initial justify-center items-center'>
                <img 
                    src={logo} 
                    alt='logo' 
                    className='w-40 md:w-48 cursor-pointer transition-all duration-300'
                    style={{
                        filter: theme === 'light' ? 'invert(1) brightness(0)' : 'none'
                    }}
                />
            </div>
            <ul className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} md:flex hidden list-none flex-row justify-between items-center flex-initial`}>
                {/* Botón de cambio de tema */}
                <li 
                    onClick={toggleTheme}
                    className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} p-3 mx-4 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg`}
                >
                    {theme === 'dark' ? <BsSun fontSize={20} className="text-yellow-400" /> : <BsMoon fontSize={20} className="text-blue-600" />}
                </li>
                <li className='bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd] transition-all duration-300 hover:scale-105 text-white'>
                    Login
                </li>
            </ul>
            <div className='flex relative'>
                {/* Botón de tema en móvil */}
                <button 
                    onClick={toggleTheme}
                    className={`${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-white text-blue-600'} p-2 mr-4 rounded-full md:hidden transition-all duration-300`}
                >
                    {theme === 'dark' ? <BsSun fontSize={20} /> : <BsMoon fontSize={20} />}
                </button>
                
                {toggleMenu
                    ? <AiOutlineClose fontSize={28} className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} md:hidden cursor-pointer`} onClick={() => setToggleMenu(false)} />
                    : <HiMenuAlt4 fontSize={28} className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} md:hidden cursor-pointer`} onClick={() => setToggleMenu(true)} />}
                {toggleMenu && (
                    <ul
                        className={`z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
                    flex flex-col justify-start items-end rounded-md ${theme === 'dark' ? 'blue-glassmorphism text-white' : 'bg-white text-gray-800'} animate-slide-in`}
                    >
                        <li className='text-xl w-full my-2'>
                            <AiOutlineClose onClick={() => setToggleMenu(false)} />
                        </li>
                        {/* Secciones ocultadas en menú móvil también */}
                        <li className='my-2 text-lg w-full'>
                            <div className='bg-[#2952e3] py-2 px-7 rounded-full cursor-pointer hover:bg-[#2546bd] text-white text-center'>
                                Login
                            </div>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default Navbar;