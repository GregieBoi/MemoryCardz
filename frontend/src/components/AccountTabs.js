import React from "react";
import Stack from "react-bootstrap/esm/Stack";
import Container from "react-bootstrap/esm/Container";
import { Link } from "react-router-dom";
import TokenStorage from "../tokenStorage";

function AccountTabs (props) {
  const { username: targetUsername } = props;
    const currentUser = TokenStorage.getUser();
    const isMe = !targetUsername || currentUser?.username === targetUsername;
    const username = (isMe ? currentUser.username : targetUsername);

  function changeColor(e) {
    e.target.style.color = '#DD2020';
    e.target.style.textDecoration = 'underline';
  }

  function revertColor(e) {
    e.target.style.color = '#A5A2A2';
    e.target.style.textDecoration = 'none';
  }

    return (
        <Container className="rounded" style={{width:'60%', backgroundColor:'#272727'}}>
            <Stack className="p-3" style={{justifyContent:'space-around', fontSize:22}} direction="horizontal">
            <div><Link to={`/profile/${username}`} onMouseOver={changeColor} onMouseLeave={revertColor} style={{ textDecoration: 'none', color:"#A5A2A2" }}> Profile </Link></div>
            <div><Link to={`/diary/${username}`} onMouseOver={changeColor} onMouseLeave={revertColor} style={{ textDecoration: 'none', color:"#A5A2A2" }}>Diary</Link></div>
            <div><Link to={`/games/${username}`} onMouseOver={changeColor} onMouseLeave={revertColor} style={{ textDecoration: 'none', color:"#A5A2A2" }}> Shelf </Link></div>
            </Stack>
        </Container>
    );
};

export default AccountTabs;