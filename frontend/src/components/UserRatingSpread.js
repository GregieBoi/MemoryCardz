import React from "react";
import { Rating } from "@mui/material";
import TokenStorage from "../tokenStorage";
import Container from "react-bootstrap/esm/Container";
import { useQuery } from "@tanstack/react-query";
import Path from "./Path";

function UserRatingSpread(props) {
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
            console.log("users", users);
            return users.results[0];
        }
    })

    const {
        data: profile,
        loggedInIsLoading
    } = useQuery({
        queryKey: ['api/searchUserId', !isMe ? profileUser : currentUser.id],
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
            const user = await response.json();
            return user;
        }
    });

    console.log("user on rating spread is", profile);
    return (
        <div></div>
    );
};

export default UserRatingSpread;