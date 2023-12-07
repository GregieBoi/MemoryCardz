import React from "react";
import TokenStorage from "../tokenStorage";
import Container from "react-bootstrap/esm/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import Path from './Path';
import { useQuery } from "@tanstack/react-query";
import GameReviewListItem from "./GameReviewListItem";



function GameReviewList(props) {

    /*
    const currentUser = TokenStorage.getUser();
    const { pageUser } = props;
    const isMe = !pageUser || currentUser?.username === pageUser;
    const targetUsername = isMe ? currentUser?.username : pageUser;
    const {
        data: idData,
        isLoading: idSearchLoading
    } = useQuery({
        enabled: !!targetUsername,
        queryKey: ['api/searchUserId', targetUsername],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const username = queryKey[1];

            const usernameSearch = await fetch(Path.buildPath('api/searchUserUsername'), {
                method: 'POST',
                body: JSON.stringify({ search: username }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const users = await usernameSearch.json();
            const userId = users.results[0];

            const response = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ userId: userId }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const yeah = await response.json();
            console.log(yeah, "is yeah");
            return yeah;
        }
    });
    */
    const reviewArray = JSON.parse(localStorage.getItem('curr_game_rev'));
    console.log("Rev" + reviewArray);
    return (
        <div>
            <Container className="rounded" style={{ marginTop: '8vh', marginBottom: '8vh', padding: '8vh', backgroundColor: '#272727', width: '95%', textDecorationColor: 'b' }}>

                <ListGroup style={{ background: 'none' }}>
                    <ListGroup.Item style={{ background: 'none', border: 'none' }}>
                        <hr style={{ color: 'white}}' }} />
                    </ListGroup.Item>
                    {reviewArray?.map((id) => {
                        return (
                            <GameReviewListItem key={id} reviewId={id} />
                        )
                    })}
                </ListGroup>
            </Container>
        </div>
    );
};

export default GameReviewList;