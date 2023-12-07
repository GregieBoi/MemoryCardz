import React from "react";
import NavBar from "../components/NavBar";
import DiaryTabs from "../components/DiaryTabs";


const ShelfPage = () =>{
    return (
        <div>
            <style>{'body { background-color: #343434; }'}</style>
            <NavBar />
            <DiaryTabs />
        </div>
    );
};

export default ShelfPage;