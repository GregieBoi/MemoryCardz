import React from "react";
import TokenStorage from "../tokenStorage";
import Container from "react-bootstrap/esm/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import Path from './Path';
import { useQuery } from "@tanstack/react-query";
import Stack from "react-bootstrap/esm/Stack";
import { useReviewQuery } from "../hooks/useReviewQuery";
//import { useFollowingQuery } from "../hooks/useFollowingQuery";
import { useUserQuery } from "../hooks/useUserQuery";
import FollowingListItem from "./FollowingListItem";

export function FollowingList(props) {
    const { username: currentPageUsername } = props;
    //const following = currentPageUsername?.following;
    //console.log(following, "is following");
    //const followingArray = following?.map(useUserQuery);
    console.log(currentPageUsername, "is user being passed in");

    const {
        data: profileUser,
        profileIdIsLoading
    } = useQuery({
        queryKey: ['api/searchUserUsername', currentPageUsername],
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
        data: currentPageId,
        loggedInIsLoading
    } = useQuery({
        queryKey: ['api/searchUserId', profileUser],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
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
            return await response.json();
        }
    })

    const following = currentPageId?.following;

    return (
        <div>
            <Container className="rounded" style={{ marginTop: '8vh', marginBottom: '8vh', padding: '8vh', backgroundColor: '#272727', width: '60%', textDecorationColor: 'b' }}>

                <p className="p-3" id="favorites">FOLLOWING</p>
                <ListGroup style={{ background: 'none' }}>
                    <ListGroup.Item style={{ background: 'none', border: 'none' }}>
                        <hr style={{ color: 'white}}' }} />
                    </ListGroup.Item>
                    {following?.map((userId) => {
                        return (
                            <FollowingListItem key={userId} followerId={userId}/>
                        )
                    })}
                </ListGroup>
            </Container>
        </div>
    );
}