import './App.css';
import './i18n/config';
import { ThemeProvider } from 'next-themes';
import Index from './pages/Index';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Index />
    </ThemeProvider>
  );
}

export default App;