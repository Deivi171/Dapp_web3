import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import logo from "../../images/logo.png";

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 py-8">
     

      <div className="flex justify-center items-center flex-col mt-5">
        <p className={`text-sm text-center font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Dapp Web3</p>
        <p className={`text-sm text-center mt-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
        }`}>Your trusted crypto platform</p>
      </div>

      <div className={`sm:w-[90%] w-full h-[0.25px] mt-5 ${
        theme === 'dark' ? 'bg-gray-400' : 'bg-gray-300'
      }`} />

      <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
        <p className={`text-left text-xs ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>@Deivi171-Project</p>
        <p className={`text-right text-xs ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>All rights reserved</p>
      </div>
    </div>
  );
};

export default Footer;