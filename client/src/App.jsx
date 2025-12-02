
import { Navbar, Welcome, Footer, Services, Transactions, ThreeCanvas } from './components';
import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { AnimatedBackground } from './components/ui';

const App = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="min-h-screen relative">
      {/* Fondo animado */}
      <AnimatedBackground theme={theme} />
      
      {/* Modelo 3D */}
      <ThreeCanvas />
      
      {/* Contenido */}
      <div className="relative z-10">
        <Navbar />
        <Welcome />
        <Services />
        <Transactions />
        <Footer />
      </div>
    </div>
  );
}

export default App
