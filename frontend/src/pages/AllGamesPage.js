import React from "react";
import Account from "../components/Account";
import AccountTabs from "../components/AccountTabs";
import UserFavorites from "../components/UserFavorites";
import UserRecentlyPlayed from "../components/UserRecentlyPlayed";
import { useParams } from "react-router-dom";
import UserRatingSpread from "../components/UserRatingSpread";
import Container from "react-bootstrap/esm/Container";
import Stack from "react-bootstrap/esm/Stack";
import NavBar from "../components/NavBar";
import { GameCards } from "../components/GameCards";

const AllGamesPage = () =>{
    const {username} = useParams();
    return(
        <div>
            <NavBar />
            <Account username={username} />
            <AccountTabs username={username} />
            <GameCards username={username}/>
            
            <style>{'body { background-color: #343434; }'}</style>
        </div>
    );
};

export default AllGamesPage;