import React from "react";
import NavBar from "../components/NavBar";
import Account from "../components/Account";

const AccountPage = () => {
    return(
        <div>
            <NavBar />
            <Account />
            <style>{'body { background-color: #343434; }'}</style>
        </div>
    );
}

export default AccountPage;