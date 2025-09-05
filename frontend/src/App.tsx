//

import './App.css';
import "./styles/markdownStyles.css";
import React from 'react';
import LandingPage from './pages/landingPage';
import HomePage from './pages/homePage';
import SignupPage from './pages/signupPage';
import SigninPage from './pages/signinPage';
import PostCreate from './components/Post/postCreate';
import PostOne from './components/Post/postOne';
import EditPost from './components/Post/editPost';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import SavedPage from './pages/savedPaged';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />

      {/* Protected pages */}
      <Route path="/home" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="/create" element={
        <ProtectedRoute>
          <PostCreate />
        </ProtectedRoute>
      } />
      <Route path="/post/:postId" element={
        <ProtectedRoute>
          <PostOne />
        </ProtectedRoute>
      } />
      <Route path="/edit/:postId" element={
        <ProtectedRoute>
          <EditPost />
        </ProtectedRoute>
      } />
      <Route path="/saved" element={
        <ProtectedRoute>
          <SavedPage />
        </ProtectedRoute>
      } />

      {/* Fallback route */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}

export default App;