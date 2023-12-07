import React from "react";
import NavBar from "../components/NavBar";
import ReviewList from "../components/ReviewList";
import { useParams } from "react-router-dom";
import DiaryList from "../components/DiaryList";
import DiaryTabs from "../components/DiaryTabs";

const DiaryPage = () => {
    const { username } = useParams();
    return (
        <div>
            <style>{'body { background-color: #343434; }'}</style>
            <NavBar />
            <DiaryTabs username={username}/>
            <DiaryList pageUser={username} />
        </div>
    );
}

export default DiaryPage;