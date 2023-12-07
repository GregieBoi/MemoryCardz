import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/esm/Row';
import Container from 'react-bootstrap/esm/Container';
import { createSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/esm/Col';
import Stack from 'react-bootstrap/esm/Stack';

import Path from "./Path";

function PopularReel() {
    const {
        data: popular,
        profileIdIsLoading
    } = useQuery({
        queryKey: ['getPopularReviews'],
        queryFn: async ({ queryKey }) => {
            const route = 'api/latestReviews'
            const reviewSearch = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({}),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const results = await reviewSearch.json();
            const popularArray = results.popular;

            return await Promise.all((popularArray || []).map(async (game) => {
                const route = 'api/searchGameId';
                const gameSearch = await fetch(Path.buildPath(route), {
                    method: 'POST',
                    body: JSON.stringify({ gameId: game }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                return await gameSearch.json();
            }));
        }
    })

    
    const latestSeven = popular?.slice(-7);
        return (
            <Container>
            <p className="p-3" id="favorites">POPULAR</p>
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

export default PopularReel;