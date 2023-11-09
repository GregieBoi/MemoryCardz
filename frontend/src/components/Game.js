import React, { useState, useEffect } from 'react';
import { useJwt } from "react-jwt";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function Game() {

    var bp = require('./Path.js');

    const gameId = "65401689db4f829dd0cadcad";

    const [message, setMessage] = useState('');

    const searchGame = async event => {
        console.log("here");
        event.preventDefault();

        const obj = {
            gameId: gameId
        };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('api/searchGameId'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());
            console.log(res);
        } catch (e) {
            console.log("error");
            console.error(e);
            return ("");
        }
    };

    return (
        <Container fluid>
            <br />
            <br />
            <Row>
                <Col>
                    <br />
                    <br />
                    <br />
                    <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/co6nqg.png" />
                    <Container className="text-center">
                        <Row>
                            <Col xs lg="3">
                                Plays
                            </Col>
                            <Col xs lg="3">
                                Lists
                            </Col>
                            <Col xs lg="3">
                                Favs
                            </Col>
                        </Row>
                    </Container>
                </Col>
                <Col xs={6}>
                    <h1><b>Pikmin</b> (2001)</h1>
                    <br />
                    <br />
                    <p>Pikmin is a 2001 real-time strategy puzle video game developed and published by Nintendo ffor hte GameCube. The game's story focuses on an alien pilot, Captain Olimar, who crash lands on a mysterious planet nad must make use of a native species called "pikmin" to find his ship's missing parts in order to escape witin 30 days. Players take control of Olimar and direct the different varieties of PIkmin to explore the game's various levels, overcoming obstacles and hostile creatures, in order to find and recover the missing ship's parts.</p>
                    <br />
                    <br />
                    <br />
                    <h4>Details</h4>
                </Col>
                <Col>
                    <br />
                    <br />
                    <Container style={{ justifyContent: "center", alignItems: "center", height: "50vh", width: "20vw", backgroundColor: '#8C8C8C', borderRadius: '5px' }} className="p-5">
                        <Row>
                            Stars
                        </Row>
                        <Row>
                            <p></p>
                            <Button variant="primary" type="button">Review</Button>
                            <p></p>
                        </Row>
                        <Row>
                            <p></p>
                            <Button variant="primary" type="button">Add to list</Button>
                            <p></p>
                        </Row>
                        <Row>
                            <p></p>
                            <Button variant="primary" type="button">Favorite</Button>
                            <p></p>
                        </Row>
                        <Row>
                            <p></p>
                            <Button variant="primary" type="button" onClick={searchGame}>Share</Button>
                            <p></p>
                        </Row>
                        <Row>

                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default Game;