// I will create the login page for the console frontend using React and MUI.
// The page will include a form with fields for email and password, a submit button, and links for "Forgot Password?" and "Sign Up".

import React from 'react'
import './App.css'
import LandingPage from './pages/landingPage';
import HomePage from './pages/homePage';
import SignupPage from './pages/signupPage';
import SigninPage from './pages/signinPage';
import PostCreate from './components/Post/postCreate';
import { Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/create" element={<PostCreate />} />
    </Routes>
  )
}

export default App;