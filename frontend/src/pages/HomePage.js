import React from 'react';

import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import GameUI from '../components/GameUI';

const HomePage = () =>
{
    return(
        <div>
            <PageTitle />
            <LoggedInName />
            <GameUI />
            <style>{'body { background-color: #343434; }'}</style>
        </div>
    );
}

export default HomePage;
