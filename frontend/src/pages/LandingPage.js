import React from 'react';
import NavBar from "../components/NavBar"
import Welcome from '../components/Welcome';
import PopularReel from '../components/PopularReel';
import FriendsReel from '../components/FriendsReel';

const LandingPage = () => {
  return (
    <div>
      <style>{'body { background-color: #343434; }'}</style>
      <NavBar />
      <Welcome />
      <PopularReel />
      <FriendsReel />
    </div>
  );
};

export default LandingPage;
