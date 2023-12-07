import React from "react";
import NavBar from "../components/NavBar";
import Account from "../components/Account";
import AccountTabs from "../components/AccountTabs";
import UserFavorites from "../components/UserFavorites";
import UserRecentlyPlayed from "../components/UserRecentlyPlayed";
import UserRatingSpread from "../components/UserRatingSpread";
import Stack from "react-bootstrap/esm/Stack";

const AccountPage = () => {
    return (
        <div>
            <NavBar />
            <Account />
            <AccountTabs />
            <Stack direction="vertical">
                <Stack direction="horizontal">
                    <UserFavorites />
                    <UserRatingSpread />
                </Stack>
                <Stack direction="horizontal">
                    <UserRecentlyPlayed />
                </Stack>
            </Stack>
            <style>{'body { background-color: #343434; }'}</style>
        </div>
    );
}

export default AccountPage;