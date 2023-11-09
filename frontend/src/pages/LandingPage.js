import React from 'react';
import NavBar from "../components/NavBar"
import Welcome from '../components/Welcome';
import NewReel from '../components/NewReel';
import Popular from '../components/Popular';
import NewFromFriends from '../components/NewFromFriends';

const LandingPage = () => {
  return (
    <div>
      <style>{'body { background-color: #343434; }'}</style>
      <NavBar />
      <Welcome />
      <Popular />
      <NewReel />
      <NewFromFriends />
      <NewReel />
    </div>
  );
};

export default LandingPage;
