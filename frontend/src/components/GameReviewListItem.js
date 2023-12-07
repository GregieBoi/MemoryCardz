import Stack from "react-bootstrap/esm/Stack";
import ListGroup from 'react-bootstrap/ListGroup';
import { useQuery } from "@tanstack/react-query";
import Path from "./Path";
import { Star } from '@mui/icons-material'
import { Rating } from "@mui/material";
import Button from 'react-bootstrap/Button';
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import React, { useState, useEffect } from 'react';

function GameReviewListItem(props) {

    var _ud = localStorage.getItem('user');
    var ud = JSON.parse(_ud);
    var userId = ud.id;

    const [isLiked, setIsLiked] = useState(false);

    const { reviewId } = props;
    const {
        data: reviewDetails,
        reviewIsLoading
    } = useQuery({
        queryKey: ['api/searchReviewId', reviewId],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const review = queryKey[1];
            const gameSearch = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ reviewId: review }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            let retReview = await gameSearch.json();
            console.log("Ret review" + reviewId + " a " + retReview?.userId);
            return await retReview;
        }
    });
    const {
        data: reviewingUser,
        userIsLoading
    } = useQuery({
        queryKey: ['api/searchUserId', reviewDetails?.userId],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const userId = queryKey[1];
            const gameSearch = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ userId: userId }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            let retPoster = await gameSearch.json();
            console.log("Ret poster" + reviewDetails?.userId + " a " + retPoster?.id + " 0 " + retPoster?.username);
            return await retPoster;
        }
    });
    const {
        data: currentUser,
        cUserIsLoading
    } = useQuery({
        queryKey: ['api/searchUserId', userId],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const userId = queryKey[1];
            const gameSearch = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ userId: userId }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            let retUser = await gameSearch.json();
            console.log("Ret user" + userId + " a " + retUser?.userId);
            console.log("Cont " + retUser?.likedGames.includes(reviewId));
            return await retUser;
        }
    });

    

    function likeReview(){
        if(isLiked){
            setIsLiked(false);
            return(<Button variant="primary" type="button"><FaHeart/></Button>);
        }else{
            setIsLiked(true);
            return(<Button variant="primary" type="button"><CiHeart/></Button>);
        }
    }

    return (
        <ListGroup.Item style={{ background: 'none', border: 'none' }}>
            <Stack direction='vertical'>
                <Stack direction="horizontal" style={{ justifyContent: 'space-between' }}>
                    <a href={"https://cop4331-25-c433f0fd0594.herokuapp.com/profile/" + reviewingUser?.username}><h4 className="ps-3" >{reviewingUser?.username}</h4></a>
                    <Rating className="justify-content-right"
                        name="customized-color"
                        precision={0.5}
                        readOnly
                        size='medium'
                        value={reviewDetails?.rating / 2}
                        sx={{ color: 'white' }}
                        style={{ color: 'red' }}
                        emptyIcon={<Star style={{ color: 'white' }} />}
                    />

                </Stack>
                <Stack direction="horizontal" className="ps-4 pt-4" style={{ justifyContent: 'space-between' }}>
                    <div>{reviewDetails?.text}</div>
                    <div>Edited:  {reviewDetails?.editDate}</div>
                    {/*likeReview*/}
                </Stack>

            </Stack>

            <hr className="-3" style={{ color: 'white}}' }} />
        </ListGroup.Item>
    );
};

export default GameReviewListItem;