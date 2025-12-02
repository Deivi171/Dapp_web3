
import { Navbar, Welcome, Footer, Services, Transactions, ThreeCanvas } from './components';
import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';

const App = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0f0e13]' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100'}`}>
      <ThreeCanvas />
      <div className={theme === 'dark' ? 'gradient-bg-welcome' : 'bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100'}>
        <Navbar />
        <Welcome />
      </div>
      <div className={theme === 'dark' ? '' : 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100'}>
        <Services />
      </div>
      <div className={theme === 'dark' ? 'gradient-bg-transactions' : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'}>
        <Transactions />
      </div>
      <div className={theme === 'dark' ? 'gradient-bg-footer' : 'bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100'}>
        <Footer />
      </div>
    </div>
  );
}

export default App
