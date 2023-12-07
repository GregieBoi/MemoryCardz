import React from "react";
import Stack from "react-bootstrap/esm/Stack";
import ListGroup from 'react-bootstrap/ListGroup';
import { useQuery } from "@tanstack/react-query";
import Path from "./Path";
import Image from "react-bootstrap/esm/Image";
import thumbnail from './ProfileThumbnail.png';
import { Link } from "react-router-dom";
import { ProfilePicture } from "./ProfilePicture";


function FollowingListItem(props) {
    const { followerId } = props;
    console.log("followed person", followerId);
    const {
        data: followedUser,
        loggedInIsLoading
    } = useQuery({
        queryKey: ['api/searchUserId', followerId],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const followerId = queryKey[1];
            const response = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({
                    userId: followerId
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return await response.json();
        }
    });
    const decider = followedUser?.username.slice(-1) || '';
    const profilePic = ProfilePicture(decider);
    return (
        <ListGroup.Item style={{ background: 'none', border: 'none' }}>
            <Link to={`/profile/${followedUser?.username}`} style={{color:'white', textDecoration:'none'}}>
            <Stack direction='horizontal' className="mb-3 pb-3">
                
                <Image className="rounded" src={profilePic} roundedCircle style={{ width: 100, paddingRight: 10 }} />
                <Stack direction='vertical'>
                        <h3 className="ps-3">{followedUser?.username}</h3>
                        <div className="ps-3">{followedUser?.firstName}</div>
                </Stack>
                
            </Stack>
            </Link>
            <hr className="-3" style={{ color: 'white}}' }} />
        </ListGroup.Item>
    );

}

export default FollowingListItem;