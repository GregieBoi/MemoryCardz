import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';
import { useQuery } from "@tanstack/react-query";
import Path from "./Path";
import TokenStorage from '../tokenStorage';
import { Link, createSearchParams } from "react-router-dom";

function UserFavorites(props) {
    const { username: targetUsername } = props;
    const currentUser = TokenStorage.getUser();
    const isMe = !targetUsername || currentUser?.username === targetUsername;
    const {
        data: profileUser,
        profileIdIsLoading
    } = useQuery({
        enabled: !isMe,
        queryKey: ['api/searchUserUsername', targetUsername],
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

    const {
        data: favorites,
        loggedInIsLoading
    } = useQuery({
        queryKey: ['userFavorites', !isMe ? profileUser : currentUser],
        queryFn: async ({ queryKey }) => {
            const route = 'api/searchUserId';
            const userId = queryKey[1];
            const response = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({
                    userId: userId
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const user = await response.json();
            return await Promise.all((user?.favorites || []).map(async (favoriteId) => {
                const route = 'api/searchGameId';
                const gameSearch = await fetch(Path.buildPath(route), {
                    method: 'POST',
                    body: JSON.stringify({ gameId: favoriteId }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                return await gameSearch.json();
            }));
        }
    })
    return (
        <Container>
            <p className="mt-3 pt-3" id="favorites">FAVORITES</p>
            <Row >
                {favorites?.map((favorite) => {
                    return (
                        <Col key={favorite?.id}>
                            <Link style={{ width: 150, height: 208, flex: '0 0 150px' }} to={{
                                pathname: `/game`,
                                search: `?${createSearchParams({ gameId: favorite?.id })}`
                            }}>
                                <Card className="align-middle" style={{ alignItems: "center", width: '12rem', height: '16rem' }}>
                                    <Card.Img variant="center" className='rounded' src={favorite?.image} style={{ width: '12rem', height: '16rem' }} />
                                </Card>
                            </Link>
                        </Col>
                    )
                })}
            </Row>
        </Container>
    );
};

export default UserFavorites;