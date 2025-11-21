import { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  useEffect(() => {
    // Set document title
    document.title = 'FitTerminal - Your Terminal Fitness Tracker';
  }, []);

  return <MainLayout />;
}

export default App;