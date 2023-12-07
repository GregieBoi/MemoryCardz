import React from "react";
import Stack from "react-bootstrap/esm/Stack";
import Container from "react-bootstrap/esm/Container";
import { Link } from "react-router-dom";
import thumbnail from './ProfileThumbnail.png'
import Image from "react-bootstrap/esm/Image";
import TokenStorage from "../tokenStorage";
import { ProfilePicture } from "./ProfilePicture";

function DiaryTabs(props) {
  const { username: targetUsername } = props;
    const currentUser = TokenStorage.getUser();
    const isMe = !targetUsername || currentUser?.username === targetUsername;
    const username = (isMe ? currentUser.username : targetUsername);


  function changeColor(e) {
    e.target.style.color = '#DD2020';
  }

  function revertColor(e) {
    e.target.style.color = '#A5A2A2';
  }

  const decider = targetUsername?.slice(-1) || currentUser?.username.slice(-1) || '';
  const profilePic = ProfilePicture(decider);

  return (
    <div style={{ marginTop: '8vh' }}>
      <Container className="rounded" style={{ width: '60%', backgroundColor: '#272727' }}>
        <Stack className="p-3" style={{ justifyContent: 'space-around', fontSize: 22 }} direction="horizontal">

          <div>
            <Link to={`/profile/${username}`}  style={{ textDecoration: 'none', color: "#A5A2A2" }}>
              <Stack direction='horizontal'>
                <Image style={{ width: 50, height: 50 }} src={profilePic} roundedCircle />
                <div onMouseOver={changeColor} onMouseLeave={revertColor} style={{ paddingLeft: 10 }}>{username}</div>
              </Stack>
            </Link>
          </div>
            <div><Link to={`/diary/${username}`} onMouseOver={changeColor} onMouseLeave={revertColor} style={{ textDecoration: 'none', color:"#A5A2A2" }}>Diary</Link></div>
            <div><Link to={`/games/${username}`} onMouseOver={changeColor} onMouseLeave={revertColor} style={{ textDecoration: 'none', color:"#A5A2A2" }}> Shelf </Link></div>
        </Stack>

      </Container>
    </div>
  );
};

export default DiaryTabs;