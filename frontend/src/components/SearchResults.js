import React from "react";
import Container from "react-bootstrap/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import { useSearchParams } from "react-router-dom";
import Path from "./Path";
import TokenStorage from '../tokenStorage.js';
import { useQuery } from '@tanstack/react-query';
import decode from "jwt-decode";
import { IgdbGame } from "./IgdbGame.js";

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const {
        data,
        isLoading
    } = useQuery({
        queryKey: ['api/searchIGDBGames', query],
        queryFn: async ({ queryKey: [route, query] }) => {
            const accessToken = TokenStorage.retrieveToken();
            const decoded = decode(accessToken, { complete: true });

            const response = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ query }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return await response.json();
        }
    });
    return (
        <Container>
            <p>Search results for "{query}"</p>
            <ListGroup>
                {data?.map((game) => {
                    return (
                        <IgdbGame key={game.id} game={game} />
                    )
                })}
            </ListGroup>
        </Container>
    );
};

export default SearchResults;