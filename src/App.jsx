import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CyclePage from './pages/CyclePage';
import TopicPage from './pages/TopicPage';
import LessonPage from './pages/LessonPage';
import RevisaoPage from './pages/RevisaoPage';
import LibraryPage from './pages/LibraryPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0815 0%, #141028 50%, #1a1533 100%)',
        gap: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <img 
            src="https://i.ibb.co/sdNZm3Vg/Pavao.png" 
            alt="MedStudy Logo" 
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'contain'
            }}
          />
          <h2 style={{
            fontFamily: "'Stack Sans Notch', sans-serif",
            fontSize: '2rem',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0
          }}>
            MedStudy
          </h2>
        </div>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(168, 85, 247, 0.2)',
          borderTopColor: '#a855f7',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ciclo/:cycleId"
        element={
          <ProtectedRoute>
            <CyclePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ciclo/:cycleId/topico/:topicId"
        element={
          <ProtectedRoute>
            <TopicPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ciclo/:cycleId/topico/:topicId/aula/:lessonId"
        element={
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        }
      />
      {/* Rotas antigas para compatibilidade */}
      <Route
        path="/topico/:topicId"
        element={
          <ProtectedRoute>
            <TopicPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/topico/:topicId/aula/:lessonId"
        element={
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/revisao"
        element={
          <ProtectedRoute>
            <RevisaoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/biblioteca"
        element={
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
