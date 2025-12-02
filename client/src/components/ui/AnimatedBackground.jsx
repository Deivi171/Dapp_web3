const AnimatedBackground = ({ theme = 'dark' }) => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className={`absolute inset-0 ${
                theme === 'dark' 
                    ? 'bg-gradient-to-br from-[#0f0c29] via-[#1a1a2e] to-[#16213e]' 
                    : 'bg-gradient-to-br from-[#e8f4f8] via-[#f0e6fa] to-[#e6f0ff]'
            }`} />
            
            <div 
                className={`absolute w-[600px] h-[600px] rounded-full blur-[120px] animate-blob ${
                    theme === 'dark' 
                        ? 'bg-purple-600/30' 
                        : 'bg-purple-400/40'
                }`}
                style={{ top: '10%', left: '15%' }}
            />
            
            <div 
                className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] animate-blob animation-delay-2000 ${
                    theme === 'dark' 
                        ? 'bg-pink-500/25' 
                        : 'bg-pink-400/35'
                }`}
                style={{ top: '40%', right: '10%' }}
            />
            
            <div 
                className={`absolute w-[550px] h-[550px] rounded-full blur-[120px] animate-blob animation-delay-4000 ${
                    theme === 'dark' 
                        ? 'bg-blue-500/25' 
                        : 'bg-blue-400/35'
                }`}
                style={{ bottom: '10%', left: '30%' }}
            />

            <div 
                className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] animate-blob animation-delay-3000 ${
                    theme === 'dark' 
                        ? 'bg-cyan-500/20' 
                        : 'bg-cyan-400/30'
                }`}
                style={{ top: '60%', left: '5%' }}
            />
        </div>
    );
};

export default AnimatedBackground;
