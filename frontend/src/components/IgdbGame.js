import { Link, createSearchParams } from "react-router-dom";
import { useGameQuery } from "../hooks/useGameQuery";
import Image from "react-bootstrap/esm/Image";
import Stack from "react-bootstrap/esm/Stack";
import ListGroup from 'react-bootstrap/ListGroup';
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Path from './Path';

function parseGameYear(firstReleaseDate) {
    if (!firstReleaseDate || typeof firstReleaseDate !== 'number') {
        return undefined;
    }
    // firstReleaseDate is seconds, converting to milliseconds 
    return new Date(firstReleaseDate * 1000).getFullYear();
}

function parseGameDay(firstReleaseDate) {
    if (!firstReleaseDate || typeof firstReleaseDate !== 'number') {
        return undefined;
    }
    // firstReleaseDate is seconds, converting to milliseconds 
    return new Date(firstReleaseDate * 1000).getDate();
}

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

function parseGameMonth(firstReleaseDate) {
    if (!firstReleaseDate || typeof firstReleaseDate !== 'number') {
        return undefined;
    }
    // firstReleaseDate is seconds, converting to milliseconds 
    return months[new Date(firstReleaseDate * 1000).getMonth()];
}

function createGame(igdbGame) {
    const newGame =
    {
        title: igdbGame.name,
        developer: JSON.stringify(igdbGame.involved_companies.map((item) => item.company.name)),
        category: JSON.stringify(igdbGame.genres?.map((item) => item.name)),
        releaseDate: `${parseGameMonth(igdbGame.first_release_date)} ${parseGameDay(igdbGame.first_release_date)}, ${parseGameYear(igdbGame.first_release_date)}`,
        igdbId: `${igdbGame.id}`,
        description: "",
        ageRating: igdbGame.age_ratings.map.rating,
        image: igdbGame.cover_url
    }
    console.log(newGame, "newgame");
    return newGame;
}

export function IgdbGame(props) {
    const { game: igdbGame } = props;
    const year = parseGameYear(igdbGame.first_release_date);
    const pStyle = {
        maxWidth: '100%',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };
    const navigate = useNavigate();
    const { data } = useGameQuery(igdbGame.id);
    const { mutateAsync } = useMutation({
        mutationFn: async (igdbGame) => {
            const response = await fetch(Path.buildPath('api/addGame'),
                {
                    method: 'POST',
                    body: JSON.stringify(
                        createGame(igdbGame)
                    ),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            return await response.json();
        }
    })
    if (!data) {
        //data = createGame(igdbGame);
    }
    if (igdbGame.category == 0 || igdbGame.category == 8 || igdbGame.category == 9 || igdbGame.category == 4) {
        return (
            <ListGroup.Item key={igdbGame.id} style={{backgroundColor:'#272727'}}>
                <Stack direction="horizontal" gap={3}>
                    {data?.id ? (
                        <div style={{ width: 150, height: 208, flex: '0 0 150px' }} onClick={async () => {
                            await navigate({
                                pathname: `/game`,
                                search: `?${createSearchParams({ gameId: data?.id })}`
                            });
                        }}>

                            <Image style={{ width: 150, height: 208, flex: '0 0 150px' }} src={igdbGame.cover_url} thumbnail />
                        </div>
                    ) : (
                        <div style={{ width: 150, height: 208, flex: '0 0 150px' }} onClick={async () => {
                            const { gameId } = await mutateAsync(igdbGame);
                            await navigate({
                                pathname: `/game`,
                                search: `?${createSearchParams({ gameId: gameId })}`
                            });
                        }}>
                            <Image style={{ width: 150, height: 208, flex: '0 0 150px' }} src={igdbGame.cover_url} thumbnail />
                        </div>
                    )}
                    <Stack direction="vertical">
                        <h2>
                            {igdbGame.name} {year ? `(${year})` : null}
                        </h2>
                        <div>
                            <p style={pStyle}>{igdbGame.summary}</p>
                        </div>
                    </Stack>
                </Stack>
            </ListGroup.Item>
        );
    } else {
        return;
    }
}