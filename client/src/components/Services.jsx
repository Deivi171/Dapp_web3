import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { GradientText } from "./ui";

const ServiceCard = ({ color, title, icon, subtitle, theme }) => (
    <div className={`flex flex-row justify-start items-center p-3 m-2 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl ${theme === 'dark'
        ? 'white-glassmorphism'
        : 'bg-white shadow-md border border-gray-200'
        }`}>
        <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color} transition-all duration-300 hover:scale-110`}>
            {icon}
        </div>
        <div className="ml-5 flex flex-col flex-1">
            <h1 className={`mt-2 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}> {title} </h1>
            <p className={`mt-2 text-sm md:w-9/12 ${theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>{subtitle}</p>
        </div>
    </div>
)

const Services = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className="flex flex-col md:flex-row w-full justify-center items-center py-12 relative z-20">
            <div className="flex-1 flex flex-col justify-start items-start md:p-20 py-12 px-4">
                <h1 className={`text-3xl sm:text-5xl py-2 animate-fadeInLeft font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                <GradientText colors={["#ffffff", "#222222"]}
                            animationSpeed={10}
                            className="font-bold"   
                    >Services that we
                    <br />
                    continue to improve</GradientText>
                    
                </h1>
                <p className={`mt-5 text-base animate-fadeInLeft delay-200 ${theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                    We are committed to providing the best crypto services in the industry.
                </p>

                <div className="flex-1 flex flex-col justify-start items-center mt-10 animate-fadeInRight w-full">
                    <ServiceCard
                        color="bg-[#2952E3]"
                        title="Security Guaranteed"
                        icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
                        subtitle="Security is guaranteed. We always maintain privacy and quality of our products."
                        theme={theme}
                    />
                    <ServiceCard
                        color="bg-[#8945F8]"
                        title="Best Exchange Rates"
                        icon={<BiSearchAlt fontSize={21} className="text-white" />}
                        subtitle="We provide the best exchange rates in the market."
                        theme={theme}
                    />
                    <ServiceCard
                        color="bg-[#F84550]"
                        title="Fastest Transactions"
                        icon={<RiHeart2Fill fontSize={21} className="text-white" />}
                        subtitle="Experience lightning fast transactions with our cutting-edge technology."
                        theme={theme}
                    />
                </div>
            </div>
            <div className="flex-1"></div>
        </div>
    );

}

export default Services;
