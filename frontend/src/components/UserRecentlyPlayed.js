import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/esm/Row';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import { useQuery } from "@tanstack/react-query";
import Path from "./Path";
import TokenStorage from '../tokenStorage';
import { Link, createSearchParams } from "react-router-dom";

function UserRecentlyPlayed(props) {
    const { username: targetUsername } = props;
    const currentUser = TokenStorage.getUser();
    const isMe = !targetUsername || currentUser?.username === targetUsername;
    const {
        data: profileUser,
        profileIdIsLoading
    } = useQuery({
        enabled: !isMe,
        queryKey: ['getUserByUsername', targetUsername],
        queryFn: async ({ queryKey }) => {
            const route = 'api/searchUserUsername';
            const username = queryKey[1];
            const usernameSearch = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ search: username }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const users = await usernameSearch.json();
            return users.results[0];
        }
    })

    const {
        data: reviewedGames,
        loggedInIsLoading
    } = useQuery({
        queryKey: ['userRecentGames', !!isMe ? currentUser : profileUser],
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
            const recentlyPlayed = await Promise.all((user?.reviewed || []).map(async (playedId) => {
                const route = 'api/searchReviewId';
                const gameSearch = await fetch(Path.buildPath(route), {
                    method: 'POST',
                    body: JSON.stringify({ reviewId: playedId }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                return await gameSearch.json();
            }));

            return await Promise.all((recentlyPlayed || []).map(async (review) => {
                const route = 'api/searchGameId';
                const gameSearch = await fetch(Path.buildPath(route), {
                    method: 'POST',
                    body: JSON.stringify({ gameId: review.gameId }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                return await gameSearch.json();
            }));
        }
    })
    const recentFour = reviewedGames?.slice(-4).reverse();
    return (
        <Container>
            <p className="mt-3 pt-3" id="favorites">RECENTLY PLAYED</p>
            <Row className="justify-content-between">
                {recentFour?.map((recentGame) => {
                    return (
                        <Col key={recentGame?.id}>
                            <Link style={{ width: 150, height: 208, flex: '0 0 150px' }} to={{
                                pathname: `/game`,
                                search: `?${createSearchParams({ gameId: recentGame?.id })}`
                            }}>
                                <Card className="align-middle" style={{ alignItems: "center", width: '12rem', height: '16rem' }}>
                                    <Card.Img variant="center" className='rounded' src={recentGame.image} style={{ width: '12rem', height: '16rem' }} />
                                </Card>
                            </Link>
                        </Col>
                    )
                })}
            </Row>
        </Container>
    );

}
export default UserRecentlyPlayed;