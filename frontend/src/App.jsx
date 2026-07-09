import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import WriteArticle from './pages/WriteArticle';
import Article from './pages/Article';


export default function App() {
  return (
    <AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="article/:id" element={<Article />} />
      <Route path="/dashboard" element={
        <PrivateRoute><UserDashboard /></PrivateRoute>
      } />
      <Route path="/admin" element={
        <AdminRoute><AdminDashboard /></AdminRoute>
      } />
      <Route path="/write" element={                         
        <PrivateRoute><WriteArticle /></PrivateRoute>
      } />
    </Routes>
  </BrowserRouter>
</AuthProvider>
  );
}