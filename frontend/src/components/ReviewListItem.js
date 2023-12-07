import React from "react";
import Stack from "react-bootstrap/esm/Stack";
import ListGroup from 'react-bootstrap/ListGroup';
import { useQuery } from "@tanstack/react-query";
import Path from "./Path";
import Image from "react-bootstrap/esm/Image";
import { Star } from '@mui/icons-material'

import { Rating } from "@mui/material";

function ReviewListItem(props) {
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
            return await gameSearch.json();
        }
    });
    const {
        data: reviewedGame,
        isLoading
    } = useQuery({
        queryKey: ['api/searchGameId', reviewDetails?.gameId],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const gameId = queryKey[1];
            const gameSearch = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ gameId: gameId }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return await gameSearch.json();
        }
    });
    console.log("reviewDetails is", reviewDetails);
    console.log("reviewed game is", reviewedGame);
    return (
        <ListGroup.Item  style={{ background: 'none', border: 'none' }}>
            <Stack direction='horizontal' className="mb-3 pb-3">
                <Image className="rounded" src={reviewedGame?.image} style={{ width: 100, paddingRight: 10}} />
                <Stack direction='vertical'>
                    <Stack direction="horizontal" style={{ justifyContent: 'space-between' }}>
                        <h3 className="ps-3">{reviewedGame?.title}</h3>
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
                    <div>{reviewDetails?.editDate}</div>
                    </Stack>

                </Stack>

            </Stack>
            <hr className="-3" style={{color:'white}}'}} />
        </ListGroup.Item>
    );
};

export default ReviewListItem;