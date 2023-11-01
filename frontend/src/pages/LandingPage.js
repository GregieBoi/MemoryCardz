import React from 'react';
import NavBar from "../components/NavBar"
import Welcome from '../components/Welcome';

const LandingPage = () => {
  return (
    <div>
      <style>{'body { background-color: #343434; }'}</style>
      <NavBar />
      <Welcome />
    </div>
  );
};

export default LandingPage;
