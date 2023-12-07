import React from "react";
import Stack from "react-bootstrap/esm/Stack";
import ListGroup from 'react-bootstrap/ListGroup';
import { useQuery } from "@tanstack/react-query";
import Path from "./Path";
import Image from "react-bootstrap/esm/Image";
import thumbnail from './ProfileThumbnail.png';
import { Link } from "react-router-dom";


function FollowersListItem(props) {
    const { followingId } = props;
    console.log("followed person", followingId);
    const {
        data: followingUser,
        loggedInIsLoading
    } = useQuery({
        queryKey: ['api/searchUserId', followingId],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const followingId = queryKey[1];
            const response = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({
                    userId: followingId
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return await response.json();
        }
    });
    return (
        <ListGroup.Item style={{ background: 'none', border: 'none' }}>
            <Link to={`/profile/${followingUser?.username}`} style={{color:'white', textDecoration:'none'}}>
            <Stack direction='horizontal' className="mb-3 pb-3">
                
                <Image className="rounded" src={thumbnail} roundedCircle style={{ width: 100, paddingRight: 10 }} />
                <Stack direction='vertical'>
                        <h3 className="ps-3">{followingUser?.username}</h3>
                        <div className="ps-3">{followingUser?.firstName}</div>
                </Stack>
                
            </Stack>
            </Link>
            <hr className="-3" style={{ color: 'white}}' }} />
        </ListGroup.Item>
    );

}

export default FollowersListItem;