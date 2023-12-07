import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import copy from "copy-to-clipboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faList, faStar, faCopy } from "@fortawesome/free-solid-svg-icons";
import Card from 'react-bootstrap/Card';
import GameReviewList from "./GameReviewList";
import ListGroup from 'react-bootstrap/ListGroup';
import { Star } from '@mui/icons-material'
import { Rating } from "@mui/material";
import Stack from "react-bootstrap/esm/Stack";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Image from 'react-bootstrap/esm/Image.js';
import { StarChart } from './StarChart.js';
import { useQuery } from '@tanstack/react-query';
import Path from './Path';

function Game(props) {
    const { game_id } = props;
    // General search stuff
    var bp = require('./Path.js');
    const searchParams = new URLSearchParams(window.location.search);

    // Gets userId
    var _ud = localStorage.getItem('user');
    var ud = JSON.parse(_ud);
    var userId = ud.id;

    // Gets gameId from url
    var gameId;
    if (searchParams.has("gameId")) {
        gameId = searchParams.get("gameId");
    } else {
        gameId = "65401689db4f829dd0cadcad";
    }

  
    // Sets up loading info
    const [gameLoaded, setGameLoaded] = useState(false);
    const [reviewLoaded, setReviewLoaded] = useState(false);

    // Sets up used variables
    const [title, setTitle] = useState("Title");
    const [category, setCategory] = useState("Category");
    const [developer, setDeveloper] = useState("Developer");
    const [release, setRelease] = useState("Jan 1 1900");
    const [image, setImage] = useState("");
    const [ageRating, setAgeRating] = useState("");
    const [workaround, setWorkaround] = useState(true);
    const [ratings, setRatings] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // Custom info
    const [favorited, setFavorited] = useState(false);
    const [starsAvg, setStarsAvg] = useState(0);
    const [favCount, setFavCount] = useState(0);
    const [revCount, setRevCount] = useState(0);
    const [listCount, setListCount] = useState(0);
    const [igdbId, setIgdbId] = useState('');
      
    const {
        data: summary,
        reviewIsLoading
    } = useQuery({
        enabled: !!igdbId,
        queryKey: ['api/searchIGDBSummary', igdbId],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const igdbId = queryKey[1];
            const summarySearch = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ id: igdbId }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            let summaryResult = await summarySearch.json();
            console.log("sumrayisudsnjkgasjg review", summaryResult);
            return summaryResult?.summary || '';
        }
    });

    // Searches the game info
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

            const res = await response.json();
            setTitle(res.title);
            setRelease(res.release);
            setImage(res.image);
            setAgeRating(res.ageRating);

            setFavorited(Array.isArray(res.favoritedBy) && res.favoritedBy.includes(userId));

            if (!Array.isArray(res.favoritedBy)) {
                setFavCount(0);
            } else {
                setFavCount(res.favoritedBy.length);
            }

            if (!Array.isArray(res.listList)) {
                setFavCount(0);
            } else {
                setFavCount(res.listList.length);
            }

            if (!Array.isArray(res.reviews)) {
                setRevCount(0);
            } else {
                setRevCount(res.reviews.length);
            }

            setIgdbId(res.igdbId);

            const ratingsArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            if (Number.isInteger(res.oneStar)) {
                ratingsArray[1] += Math.max(res.oneStar,0);
            }
            if (Number.isInteger(res.twoStars)) {
                ratingsArray[2] += Math.max(res.twoStars,0);
            }
            if (Number.isInteger(res.threeStars)) {
                ratingsArray[3] += Math.max(res.threeStars,0);
            }
            if (Number.isInteger(res.fourStars)) {
                ratingsArray[4] += Math.max(res.fourStars,0);
            }
            if (Number.isInteger(res.fiveStars)) {
                ratingsArray[5] += Math.max(res.fiveStars, 0);
            }
            if (Number.isInteger(res.sixStars)) {
                ratingsArray[6] += Math.max(res.sixStars, 0);
            }
            if (Number.isInteger(res.sevenStars)) {
                ratingsArray[7] += Math.max(res.sevenStars, 0);
            }
            if (Number.isInteger(res.eightStars)) {
                ratingsArray[8] += Math.max(res.eightStars, 0);
            }
            if (Number.isInteger(res.nineStars)) {
                ratingsArray[9] += Math.max(res.nineStars,0);
            }
            if (Number.isInteger(res.tenStars)) {
                ratingsArray[10] += Math.max(res.tenStars, 0);
            }
            setRatings(ratingsArray);
            console.log("ratings oihasgfhigasfiohasfgioadf", ratingsArray);

            /// replace single quotes in Flutter array with double so it can be JSON parsed
            function fixFlutter(stringifiedArray) {
                return stringifiedArray.replace("['", "[\"").replaceAll("','", "\",\"").replace("']", "\"]");
            }

            var cat = res.category ? JSON.parse(fixFlutter(res.category)) : [];
            var catStr = "";
            var dev = res.developer ? JSON.parse(fixFlutter(res.developer)) : [];
            var devStr = "";

            if (cat.length == 0) {
                catStr = "Videogame";
            } else if (cat.length == 1) {
                catStr = cat[0] + "game";
            } else {
                for (let i = 0; i < cat.length - 1; i++) {
                    catStr = catStr.concat(cat[i]);
                    if (i < cat.length - 2) {
                        catStr = catStr.concat(", ");
                    }
                }
                catStr = catStr.concat(" and " + cat[cat.length - 1] + " game");
            }

            if (dev.length == 0) {
                devStr = "Unknown";
            } else if (dev.length == 1) {
                devStr = dev[0];
            } else {
                for (let i = 0; i < dev.length - 1; i++) {
                    devStr = devStr.concat(dev[i]);
                    if (i < dev.length - 2) {
                        devStr = devStr.concat(", ");
                    }
                }
                devStr = devStr.concat(" and " + dev[dev.length - 1]);
            }

            setCategory(catStr);
            setDeveloper(devStr);

            var avgNum = 0, avgDen = 0;

            var reviews = res.reviews || [];


            var reviewData = [];
            if (Array.isArray(reviews)) {
                console.log("Reviews length is " + reviews.length);
                for (let i = 0; i < reviews.length; i++) {

                    console.log("Current review id is " + reviews[i]);
                    const objRv = {
                        reviewId: reviews[i]
                    };
                    const jsRv = JSON.stringify(objRv);

                    try {
                        // Jacob suggested hardcoding that when it wasn't working before
                        const response = await fetch(bp.buildPath('api/searchReviewId'),
                            { method: 'POST', body: jsRv, headers: { 'Content-Type': 'application/json' } });

                        var resRv = JSON.parse(await response.text());

                        var noMatchRv = true;
                        for (let i = 0; i < reviewData.length; i++) {
                            if (reviewData[i].id == resRv.id) {
                                noMatchRv = false;
                            }
                        }
                        reviewData.push(resRv);

                    } catch (e) {
                        console.log("error");
                        console.error(e);
                    }

                    const objUs = {
                        userId: resRv.userId
                    };
                    const jsUs = JSON.stringify(objUs);

                    try {
                        // Jacob suggested hardcoding that when it wasn't working before
                        const response = await fetch(bp.buildPath('api/searchUserId'),
                            { method: 'POST', body: jsUs, headers: { 'Content-Type': 'application/json' } });

                        var resUs = JSON.parse(await response.text());
                        reviewData[reviewData.length - 1]["username"] = resUs.username;
                        if (Array.isArray(resRv.likedBy)) {
                            reviewData[reviewData.length - 1]["likeCount"] = resRv.likedBy.length;
                        } else {
                            reviewData[reviewData.length - 1]["likeCount"] = 0;
                        }
                        console.log("C");
                        reviewData[reviewData.length - 1]["index"] = reviewData.length - 1;

                        if (Array.isArray(resRv.likedBy) && resRv.likedBy.includes(userId)) {
                            reviewData[reviewData.length - 1]["liked"] = true;
                            console.log("A");
                        } else {
                            reviewData[reviewData.length - 1]["liked"] = false;
                            console.log("B");
                        }

                    } catch (e) {
                        console.log("error");
                        console.error(e);
                    }

                }
            }

            console.log(reviews.length + " " + reviewData.length)

            console.log("Reviews");
            for (let i = 0; i < reviews.length; i++) {
                console.log(reviews[i]);
            }
            console.log("ReviewData");
            for (let i = 0; i < reviewData.length; i++) {
                console.log(reviewData[i].id + " " + reviewData[i].username + reviewData[i].liked);
            }



            localStorage.setItem('curr_game_rev', JSON.stringify(reviewData));

            //console.log("Logged + " + JSON.parse(localStorage.getItem('curr_game_rev'))[0].liked + JSON.parse(localStorage.getItem('curr_game_rev'))[0].index);

            setGameLoaded(true);

        } catch (e) {
            console.log("error");
            console.log(e);
            console.error(e);
            return ("");
        }
    };

    function displayReviews() {

        const reviews = JSON.parse(localStorage.getItem('curr_game_rev'))

        if (Array.isArray(reviews)) {
            return (
                <div>
                    <Container className="rounded" style={{ marginTop: '8vh', marginBottom: '8vh', padding: '8vh', backgroundColor: '#272727', width: '80%', textDecorationColor: 'b' }}>

                        <h3 align="center">Reviews</h3>
                        <ListGroup style={{ background: 'none' }}>
                            <ListGroup.Item style={{ background: 'none', border: 'none' }}>
                                <hr style={{ color: 'white}}' }} />
                            </ListGroup.Item>
                            {reviews?.map((review) => {
                                return (
                                    <ListGroup.Item style={{ background: 'none', border: 'none' }}>
                                        <Stack direction='vertical'>
                                            <Stack direction="horizontal" style={{ justifyContent: 'space-between' }}>
                                                <a style={{ textDecoration: 'none', color: 'white' }} href={"https://cop4331-25-c433f0fd0594.herokuapp.com/profile/" + review.username}><h4 className="ps-3" >{review.username}</h4></a>
                                                <Rating className="justify-content-right"
                                                    name="customized-color"
                                                    precision={0.5}
                                                    readOnly
                                                    size='medium'
                                                    value={review.rating / 2}
                                                    sx={{ color: 'white' }}
                                                    style={{ color: 'red' }}
                                                    emptyIcon={<Star style={{ color: 'white' }} />}
                                                />

                                            </Stack>
                                            <Stack direction="vertical" className="ps-4 pt-4" style={{ justifyContent: 'space-between' }}>
                                                <div>{review.text}</div>
                                                <Stack direction="horizontal" className="pt-4" style={{ justifyContent: 'space-between' }}>
                                                    <div>{review.editDate}</div>
                                                    <div>{getLikes(review.index)} {review.likeCount}</div>
                                                </Stack>
                                            </Stack>

                                        </Stack>

                                        <hr className="-3" style={{ color: 'white}}' }} />
                                    </ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                    </Container>
                </div>
            )
        } else {
            <p>No reviews found.</p>
        }

    };

    async function addFavorite() {
        setFavorited(true);
        setFavCount(getFavByCount() + 1);
        //event.preventDefault();
        const obj = {
            userId: userId,
            gameId: gameId
        };
        const js = JSON.stringify(obj);

        try {
            // Jacob suggested hardcoding that when it wasn't working before
            const response = await fetch("https://cop4331-25-c433f0fd0594.herokuapp.com/api/addFavorite",
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });


        } catch (e) {
            console.log("error");
            console.error(e);
        }
    };

    async function deleteFavorite() {
        setFavorited(false);
        setFavCount(getFavByCount() - 1);
        //event.preventDefault();
        const obj = {
            userId: userId,
            gameId: gameId
        };
        const js = JSON.stringify(obj);

        try {
            // Jacob suggested hardcoding that when it wasn't working before
            const response = await fetch("https://cop4331-25-c433f0fd0594.herokuapp.com/api/deleteFavorite",
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });


        } catch (e) {
            console.log("error");
            console.error(e);
        }
    };

    async function addLike(index) {

        console.log("Start add like");
        const reviews = JSON.parse(localStorage.getItem('curr_game_rev'));

        console.log("Should be false " + reviews[index].liked);

        reviews[index].liked = true;
        reviews[index].likeCount++;
        localStorage.setItem('curr_game_rev', JSON.stringify(reviews));

        var test = JSON.parse(localStorage.getItem('curr_game_rev'));
        console.log("Should be true " + test[index].liked);

        setWorkaround(!workaround);

        console.log("End add like");
        //event.preventDefault();
        const obj = {
            userId: userId,
            reviewId: reviews[index].id
        };
        const js = JSON.stringify(obj);

        try {
            // Jacob suggested hardcoding that when it wasn't working before
            const response = await fetch("https://cop4331-25-c433f0fd0594.herokuapp.com/api/addLike",
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });


        } catch (e) {
            console.log("error");
            console.error(e);
        }
    };

    async function deleteLike(index) {

        console.log("Start delete like");
        const reviews = JSON.parse(localStorage.getItem('curr_game_rev'));

        console.log("Should be true " + reviews[index].liked);

        reviews[index].liked = false;
        reviews[index].likeCount--;
        localStorage.setItem('curr_game_rev', JSON.stringify(reviews));

        var test = JSON.parse(localStorage.getItem('curr_game_rev'));
        console.log("Should be false " + test[index].liked);

        setWorkaround(!workaround);

        console.log("Delete like");
        //event.preventDefault();
        const obj = {
            userId: userId,
            reviewId: reviews[index].id
        };
        const js = JSON.stringify(obj);

        try {
            // Jacob suggested hardcoding that when it wasn't working before
            const response = await fetch("https://cop4331-25-c433f0fd0594.herokuapp.com/api/deleteLike",
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });


        } catch (e) {
            console.log("error");
            console.error(e);
        }
    };

    function getTitle() {
        return title;
    }

    function getCategory() {
        return category;
    }

    function getDeveloper() {
        return developer;
    }

    function getRelease() {
        return release;
    }

    function getImage() {
        return image;
    }

    function getAgeRating() {
        return ageRating;
    }

    function getStarsAvg() {
        return (
            <>
                <h4>Rating</h4>
                <Rating className="align-items-center"
                    name="customized-color"
                    precision={0.5}
                    readOnly
                    size='large'
                    value={starsAvg / 2}
                    sx={{ color: 'white' }}
                    style={{ color: 'red' }}
                    emptyIcon={<Star style={{ color: 'white' }} fontSize="inherit" />}
                />
            </>
        );
    }

    function getReviewsCount() {
        return revCount;
    }

    function getFavByCount() {
        return favCount;
    }

    function getListListCount() {
        return listCount;
    }

    function getFavorites() {
        if (favorited) {
            return (
                <>
                    <Button variant="primary" type="button" onClick={() => deleteFavorite()}><FontAwesomeIcon icon={faStar} />Unfavorite</Button>
                </>
            )
        } else {
            return (
                <>
                    <Button variant="primary" type="button" onClick={() => addFavorite()}><FontAwesomeIcon icon={faStar} />Favorite</Button>
                </>
            )
        }
    }

    function getLikes(index) {

        //console.log("IS LIKED" + JSON.parse(localStorage.getItem('curre_game_rev'))[0].liked + " " + JSON.parse(localStorage.getItem('curr_game_rev'))[0].index + " " + index);
        const review = JSON.parse(localStorage.getItem('curr_game_rev'))[index];
        //console.log("Is the review liked?" + review.liked);


        if (review.liked) {
            console.log("Above should be true");
            return (
                <>
                    <Button variant="primary" type="button" onClick={() => deleteLike(index)}><FaHeart /></Button>
                </>
            )
        } else {
            console.log("Above should be false");
            return (
                <>
                    <Button variant="primary" type="button" onClick={() => addLike(index)}><CiHeart /></Button>
                </>
            )
        }
    }

    function copyLink() {
        var copyText = "https://cop4331-25-c433f0fd0594.herokuapp.com/game?gameId=" + gameId;
        copy(copyText);
        alert("You have copied a share link for the game");
    }

    function buttonNotWorking() {
        alert("Currently under construction.");
    }

    async function pageLoad() {

        await searchGame();
        displayReviews();
    }

    useEffect(() => {
        pageLoad();
    }, [])




    // Returns the page
    if (!gameLoaded) {
        return (
            <p>Loading...</p>
        );
    } else {
        return (
            <div fluid>
                <Row>
                    <Col>
                        <br />
                        <h1><b>{getTitle()}</b> ({getRelease()})</h1>
                        <br />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Image src={getImage()} rounded className="border border-danger" style={{ height: '40vh' }} />
                        <Container >
                            <Row style={{ alignItems: 'center' }} className="ms-4 me-3 pt-3">
                                <Col>
                                    <FontAwesomeIcon icon={faGamepad} style={{ fontSize: 20 }} /> {getReviewsCount()}
                                </Col>
                                {/*
                                <Col xs lg="3">
                                    <FontAwesomeIcon icon={faList} /> {getListListCount()}
                                </Col>
                                */}
                                <Col>
                                    <FontAwesomeIcon icon={faStar} style={{ fontSize: 20 }} /> {getFavByCount()}
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col className="mt-5" style={{fontSize:18 }}>
                        <p>{getCategory()} by {getDeveloper()}</p>
                        <p>{summary}</p>
                    </Col>
                    <Col>
                        <Container style={{ justifyContent: "center", alignItems: "center", height: "40vh", width: "20vw", maxWidth:360, backgroundColor: '#272727', borderRadius: '5px'}} className="p-5">
                            <Row>
                                <StarChart ratings={ratings} />
                            </Row>
                            <Row>
                                <p></p>
                                <Button as={Link} to={"/review?gameId=" + gameId} variant="primary" type="button"><FontAwesomeIcon icon={faGamepad} />Review</Button>
                                <p></p>
                            </Row>
                            {/*
                            <Row>
                                <p></p>
                                <Button variant="primary" type="button" onClick={buttonNotWorking}><FontAwesomeIcon icon={faList} /> Add to list</Button>
                                <p></p>
                            </Row>
                            */}
                            <Row>
                                <p></p>
                                {getFavorites()}
                                <p></p>
                            </Row>
                            <Row>
                                <p></p>
                                <Button variant="primary" type="button" onClick={copyLink}><FontAwesomeIcon icon={faCopy} />Share</Button>
                                <p></p>
                            </Row>
                            <Row>
                            </Row>
                        </Container>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>{displayReviews()}</p>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Game;