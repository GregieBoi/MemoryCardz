import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import RRating from 'react-rating-system';
import { Star } from '@mui/icons-material'
import { Rating } from "@mui/material";

function Game() {

    var bp = require('./Path.js');
    const searchParams = new URLSearchParams(window.location.search);

    const [title, setTitle] = useState("Title");
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("My totally awesome review");
    const [isLog, setIsLog] = useState(false);

    const [gameLoaded, setGameLoaded] = useState(false);
    const [reviewLoaded, setReviewLoaded] = useState(false);

    var searching = true;

    var _ud = localStorage.getItem('user');
    var ud = JSON.parse(_ud);

    var userId = ud.id;
    var gameId = searchParams.get("gameId");
    const [reviewId, setReviewId] = useState("");

    async function searchGame() {

        //event.preventDefault();

        const obj = {
            gameId: gameId
        };
        const js = JSON.stringify(obj);

        try {
            // Jacob suggested hardcoding that when it wasn't working before
            const response = await fetch(bp.buildPath('api/searchGameId'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());
            setTitle(res.title);

            setGameLoaded(true);
        } catch (e) {
            console.log("error");
            console.error(e);
            return ("");
        }
    };

    async function searchReview() {
        //event.preventDefault();

        console.log("rev id" + reviewId + "-");
        console.log("S: " + searching);
        if (reviewId == "" && searching) {
            searching = false;
            console.log("s" + searching);

            console.log(new Date().toLocaleDateString());
            const objUsr = {
                userId: userId,
                gameId: gameId,
                createDate: new Date().toLocaleDateString()
            };
            const jsUsr = JSON.stringify(objUsr);

            try {
                // Jacob suggested hardcoding that when it wasn't working before
                const response = await fetch(bp.buildPath('api/addReview'),
                    { method: 'POST', body: jsUsr, headers: { 'Content-Type': 'application/json' } });

                var resUsr = JSON.parse(await response.text());

                setReviewId(resUsr.reviewId);

            } catch (e) {
                console.log("error");
                console.error(e);
            }

            // Gets the actual review info
            const obj = {
                reviewId: resUsr.reviewId
            };
            const js = JSON.stringify(obj);

            try {
                // Jacob suggested hardcoding that when it wasn't working before
                const response = await fetch(bp.buildPath('api/searchReviewId'),
                    { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

                var res = JSON.parse(await response.text());

                setRating(res.rating);
                setReviewText(res.text);
                setIsLog(res.isLog);

                setReviewLoaded(true);
                return res;
            } catch (e) {
                console.log("error");
                console.error(e);
                return ("");
            }
        }
    };

    async function updateReview() {
        //event.preventDefault();
        console.log("Entered update review");
        const obj = {
            userId: userId,
            gameId: gameId,
            reviewId: reviewId,
            editDate: new Date().toLocaleDateString(),
            rating: rating,
            textComment: reviewText,
            isLog: reviewText == ""
        };
        const js = JSON.stringify(obj);
        console.log("Going to use " + js);

        try {
            // Jacob suggested hardcoding that when it wasn't working before
            const response = await fetch("https://cop4331-25-c433f0fd0594.herokuapp.com/api/updateReviewInfo",
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            //window.location.replace("https://cop4331-25-c433f0fd0594.herokuapp.com/review?gameId=" + gameId + "&reviewId=" + reviewId);
            console.log("It says " + response);


        } catch (e) {
            console.log("error");
            console.error(e);
        }
    };

    function getTitle() {
        return title;
    }

    function ToggleButton() {
        setIsLog(!isLog);
    }

    function getrating() {
        return rating;
    }

    function getReviewText() {
        return reviewText;
    }

    function getIsLog() {
        return isLog;
    }

    function buttonNotWorking() {
        alert("Currently under construction.");
    }

    async function updateAndRedirect() {
        await updateReview();
        alert("Review updated!");
    }

    useEffect(() => {
        searchGame();
        searchReview();
    }, [])

    if (gameId == "" || reviewId == "") {
        return (
            <p>Loading all data...</p>
        )
    } else if (!gameLoaded || !reviewLoaded) {
        return (
            <p>Loading...</p>
        );
    } else {
        return (
            <Container fluid>
                <br />
                <br />
                <Container style={{ justifyContent: "center", alignItems: "center", height: "90vh", width: "80vw", backgroundColor: '#8C8C8C', borderRadius: '5px' }} className="p-5">
                    <h1><b>Review for {getTitle()}</b></h1>
                    <br />
                    <br />

                    <Form method="" action="">
                        <br />
                        <br />

                        <Form.Label>Game Rating</Form.Label>

                        <br />

                        <Rating className="justify-content-right"
                            name="customized-color"
                            precision={0.5}
                            size='medium'
                            defaultValue={getrating() / 2}
                            sx={{ color: 'white' }}
                            style={{ color: 'red' }}
                            emptyIcon={<Star style={{ color: 'white' }} />}
                            onChange={(event, newValue) => {
                                setRating(newValue * 2);
                            }}
                        />
                        <br />
                        <br />
                        <br />


                        <Form.Group className="mb-3" controlId="formGroupText" >
                            <Form.Label>Review Text</Form.Label>
                            <Form.Control name="text" as="textarea" placeholder={reviewText} style={{ fontSize: '12px', height: "20vh" }} defaultValue={reviewText} onBlur={(curText) => setReviewText(curText.target.value)} />
                        </Form.Group>


                        <br />
                        <Button variant="primary" className="button-block" type="button" onClick={updateAndRedirect}>Submit</Button>
                    </Form>
                </Container>
            </Container>
        );
    }
}

export default Game;