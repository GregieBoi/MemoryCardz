import React from "react";
import { FollowingList } from "../components/FollowingList";
import { useParams } from "react-router-dom";
import NavBar from '../components/NavBar';
import AccountTabs from '../components/AccountTabs'
import Account from "../components/Account";

const FollowingPage = () => {
    const { username } = useParams();
    return (
        <div>
            <style>{'body { background-color: #343434; }'}</style>
            <NavBar />
            <Account username={username} />
            <AccountTabs username={username}/>
            <FollowingList username={username} />
        </div>
    );
}

export default FollowingPage;