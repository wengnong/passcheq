import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GeneratePage from './pages/GeneratePage'
import HistoryPage from './pages/HistoryPage'
import CheckerPage from './pages/CheckerPage'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/generate-password" element={<GeneratePage />} />
      <Route path="/history-password" element={<HistoryPage />} />
      <Route path="/check-password" element={<CheckerPage />} />
    </Routes>
  );
};

export default App