import React from "react";
import Container from "react-bootstrap/esm/Container";
import Stack from "react-bootstrap/esm/Stack";
import Image from 'react-bootstrap/Image';
import Button from "react-bootstrap/esm/Button";
import thumbnail from './ProfileThumbnail.png'
import NumberTile from "./NumberTile";
import TokenStorage from "../tokenStorage";
import Path from './Path';
import { Link } from "react-router-dom";
import { ProfilePicture } from "./ProfilePicture";

import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function Account(props) {
    const { username: targetUsername } = props;
    const currentUser = TokenStorage.getUser();
    const name = targetUsername || currentUser?.username || '';
    const isMe = !targetUsername || currentUser?.username === targetUsername;
    const navigate = useNavigate();
    const decider = name.slice(-1);
    const profilePic  = ProfilePicture(decider);
    
    console.log("pfp", profilePic);
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


    const firstName = (isMe ? currentUser?.firstName : profileUser?.firstName) || "";
    const username = (isMe ? currentUser?.username : targetUsername) || "";
    // console.log(currentUser, " is current User");
    // console.log(profileUser, " is profile User");

    const queryClient = useQueryClient();

    const {
        data: loggedInUser,
        loggedInIsLoading
    } = useQuery({
        queryKey: ['api/searchUserId', currentUser?.id],
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


    const isFollowing = (!isMe && loggedInUser?.following?.includes(profileUser?.id)) || false;
    async function handleClick() {
        if (isMe) {
            navigate({ pathname: '/account' });
        } else {
            if (!profileUser || !currentUser) {
                return;
            }
            if (isFollowing) {
                const unfollow = await fetch(Path.buildPath('api/unfollowUser'),
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            userId: currentUser.id,
                            followId: profileUser.id
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                )
                console.log(await unfollow.json());
            } else {
                const follow = await fetch(Path.buildPath('api/followUser'),
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            userId: currentUser.id,
                            followId: profileUser.id
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                )
                console.log(await follow.json());
            }
            await queryClient.invalidateQueries(['api/searchUserId', currentUser.id]);
        }
    }

    const displayUser = (!!isMe ? loggedInUser : profileUser);
    const numReviewedGames = (!!displayUser?.reviewed ? displayUser.reviewed.length : 0);
    const numFollowers = (!!displayUser?.followers ? displayUser.followers.length : 0);
    const numFollowing = (!!displayUser?.following ? displayUser.following.length : 0);

    return (
        <Container className="p-5">
            <Stack direction="horizontal">
                <div style={{ paddingRight: 18 }}><Image style={{ width: 100, height: 100 }} src={profilePic} roundedCircle /></div>
                <div >
                    <div style={{ fontSize: '36px' }}>{firstName}</div>
                    <div style={{ fontSize: '15px', opacity: 0.8, fontStyle: 'italic', paddingBottom: 10 }}> {username}</div>
                    <Button style={{ minWidth: 150 }} variant="primary" className="button-block" onClick={handleClick}>
                        {isMe ? `Edit Profile` : isFollowing ? `Unfollow` : `Follow`}
                    </Button>
                </div>
                <Stack className="ms-auto" direction="horizontal">
                    <Link style={{ textDecoration: 'none', color: '#fff' }} to={`/games/${displayUser?.username}`}>
                        <NumberTile label={'GAMES'} value={numReviewedGames} />
                    </Link>
                    <div style={{ width: 1, backgroundColor: 'white', height: '80%' }}></div>
                    <Link style={{ textDecoration: 'none', color: '#fff' }} to={`/following/${displayUser?.username}`}>
                        <NumberTile label={'FOLLOWING'} value={numFollowing} />
                    </Link>
                    <div style={{ width: 1, backgroundColor: 'white', height: '80%' }}></div>
                    <Link style={{ textDecoration: 'none', color: '#fff' }} to={`/followers/${displayUser?.username}`}>
                        <NumberTile label={'FOLLOWERS'} value={numFollowers} />
                    </Link>
                </Stack>
                <p></p>
            </Stack>
        </Container>
    );
};

export default Account;