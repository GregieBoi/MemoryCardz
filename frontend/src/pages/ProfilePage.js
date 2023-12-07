import React from "react";
import NavBar from "../components/NavBar";
import Account from "../components/Account";
import AccountTabs from "../components/AccountTabs";
import UserFavorites from "../components/UserFavorites";
import UserRecentlyPlayed from "../components/UserRecentlyPlayed";
import { useParams } from "react-router-dom";
import UserRatingSpread from "../components/UserRatingSpread";
import Container from "react-bootstrap/esm/Container";
import Stack from "react-bootstrap/esm/Stack";
import Image from "react-bootstrap/esm/Image";
import cowboy from "../media/cowboy.png"
import { StarChart } from "../components/StarChart";
import TokenStorage from "../tokenStorage";
import Path from '../components/Path';
import { useQuery } from '@tanstack/react-query';
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const ProfilePage = () => {
    const { username } = useParams();
    const currentUser = TokenStorage.getUser();
    const name = username || currentUser?.username || '';
    const isMe = !username || currentUser?.username === username;

    const {
        data: profileUser,
        profileIdIsLoading
    } = useQuery({
        queryKey: ['api/searchUserUsername', name],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const username = queryKey[1];
            const usernameSearch = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ search: username }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const users = await usernameSearch.json();
            const userID = users.results[0];
            const userSearch = await fetch(Path.buildPath('api/searchUserId'),
                {
                    method: 'POST',
                    body: JSON.stringify({ userId: userID }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            return await userSearch.json();
        }
    })
    console.log("profile uuser", profileUser);


    return (
        <div>
            <NavBar />
            <Account username={username} />
            <AccountTabs username={username} />
            <Container><Stack direction="vertical">
                <Row>
                    <Col xs={9}>
                        <UserFavorites username={username} />
                    </Col>
                    <Col xs={3}>
                        <div style={{ height: 340, alignItems: 'flex-end', display: 'flex', flex: 0 }}>
                            <StarChart ratings={profileUser?.reviewSpread} />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={9}>
                        <UserRecentlyPlayed username={username} />
                    </Col>
                    <Col xs={3}>

                        <div style={{ height: 340, alignItems: 'flex-end', display: 'flex', flex: 0 }}>
                            <Image src={cowboy} style={{ width: 300, objectFit: 'contain' }} />
                        </div>
                    </Col>
                </Row>
            </Stack>
            </Container>
            <style>{'body { background-color: #343434; }'}</style>
        </div>
    );
}

export default ProfilePage;