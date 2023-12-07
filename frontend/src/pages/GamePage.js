import React from 'react'
import Game from '../components/Game';
import NavBar from '../components/NavBar';
import { useParams } from "react-router-dom";
import Container from 'react-bootstrap/esm/Container';

const GamePage = () => {
    const { game_id } = useParams();
    return (
        <div>
            <NavBar />
            <Container>
                <Game gameId={game_id} />
            </Container>
            <style>{'body { background-color: #343434; }'}</style>
        </div>
    );
};
export default GamePage;