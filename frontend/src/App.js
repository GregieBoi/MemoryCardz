import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';
import ResetPageOne from './pages/ResetPageOne';
import ResetPageTwo from './pages/ResetPageTwo';
import LandingPage from './pages/LandingPage';
import AccountPage from './pages/ProfilePage';
import GamePage from './pages/GamePage';
import DiaryPage from './pages/DiaryPage';
import ShelfPage from './pages/ShelfPage';
import ReviewPage from './pages/ReviewPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import FollowingPage from './pages/FollowingPage';
import FollowersPage from './pages/FollowersPage';
import AllGamesPage from './pages/AllGamesPage';
import "@fontsource/istok-web";
import "@fontsource/bungee";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/resetOne" element={<ResetPageOne />} />
          <Route path="/resetTwo" element={<ResetPageTwo />} />
          <Route path="/activity" element={<DiaryPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/diary/:username?" element={<DiaryPage />} />
          <Route path="/shelf" element={<ShelfPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile/:username?" element={<ProfilePage />} />
          <Route path="/edit" element={<EditProfilePage />} />
          <Route path="/following/:username?" element={<FollowingPage />} />
          <Route path="/followers/:username?" element={<FollowersPage />} />
          <Route path="/games/:username?" element={<AllGamesPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
