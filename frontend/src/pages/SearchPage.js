import React from "react";
import NavBar from "../components/NavBar";
import SearchResults from "../components/SearchResults";

const SearchPage = () =>{
    return(
        <div>
            <style>{'body { background-color: #343434; }'}</style>
            <NavBar />
            <SearchResults />
        </div>
    );
};

export default SearchPage;