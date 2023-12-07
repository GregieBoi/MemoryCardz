import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import { createSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TokenStorage from '../tokenStorage';
import Stack from 'react-bootstrap/esm/Stack';

import Path from "./Path";

function FriendsReel() {
    const currentUser = TokenStorage.getUser();
    const {
        data: friends,
        profileIdIsLoading
    } = useQuery({
        queryKey: ['getFriendReviews', currentUser.id],
        queryFn: async ({ queryKey }) => {
            const route = 'api/latestFollowingReviews'
            const userId = queryKey[1];
            const reviewSearch = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ userId: userId}),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const results = await reviewSearch.json(); // contains object with reviews with ids

            const reviewIdArray = results.reviews; // just the reviews array

            const recentlyPlayed = await Promise.all((reviewIdArray || []).map(async (reviewId) => {
                const route = 'api/searchReviewId';
                const gameSearch = await fetch(Path.buildPath(route), {
                    method: 'POST',
                    body: JSON.stringify({ reviewId: reviewId }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                return await gameSearch.json(); // returns individual review details

            })); // returns array of reviews with their details

            return await Promise.all((recentlyPlayed || []).map(async (game) => {
                const route = 'api/searchGameId';
                const gameSearch = await fetch(Path.buildPath(route), {
                    method: 'POST',
                    body: JSON.stringify({ gameId: game.gameId }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                return await gameSearch.json(); // return game details
            })); // returns array of games with their details
        }
    })

    const latestSeven = friends?.slice(-7);
        return (
            <Container className="pt-5">
            <p className="p-3" id="favorites">NEW FROM FRIENDS</p>
            <Stack direction="horizontal" gap={2}>
                {latestSeven?.map((game, index) => {
                    return (
                            <Link key={`${index}`} style={{ flex: '0 0 150px' }} to={{
                                pathname: `/game`,
                                search: `?${createSearchParams({ gameId: game?.id })}`
                            }}>
                                <Card className="align-middle" style={{ alignItems: "center", width: '12rem', height: '16rem' }}>
                                    <Card.Img variant="center" className='rounded' src={game.image} style={{ width: '12rem', height: '16rem' }} />
                                </Card>
                            </Link>
                    )
                })}
            </Stack>
        </Container>
    );
};

export default FriendsReel;