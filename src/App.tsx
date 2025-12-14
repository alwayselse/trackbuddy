import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Goals from './pages/Goals';
import TimeLog from './pages/TimeLog';
import Progress from './pages/Progress';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TimeLog />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
