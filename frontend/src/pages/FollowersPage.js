import React from "react";
import { useParams } from "react-router-dom";
import NavBar from '../components/NavBar';
import AccountTabs from '../components/AccountTabs'
import Account from "../components/Account";
import { FollowersList } from "../components/FollowersList";

const FollowersPage = () => {
    const { username } = useParams();
    return (
        <div>
            <style>{'body { background-color: #343434; }'}</style>
            <NavBar />
            <Account username={username} />
            <AccountTabs username={username} />
            <FollowersList username={username} />
        </div>
    );
}

export default FollowersPage;