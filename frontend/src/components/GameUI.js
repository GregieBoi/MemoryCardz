import React, { useState } from 'react';
import { useJwt } from "react-jwt";

function GameUI()
{
    var bp = require('./Path.js');

    var game = '';
    var search = '';

    const [message,setMessage] = useState('');
    const [searchResults,setResults] = useState('');
    const [gameList,setGameList] = useState('');

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud._id;
    var firstName = ud.first_name;
    var lastName = ud.last_name;
	
    const addGame = async event => 
    {
	    event.preventDefault();

        var storage = require('../tokenStorage.js');            
        var obj = {_id:userId,game:game.value,jwtToken:storage.retrieveToken()}; ////////////////////
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch(bp.buildPath('api/addGame'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var txt = await response.text();
            var res = JSON.parse(txt);

            if( res.error && res.error.length > 0 )
            {
                setMessage( "API Error:" + res.error );
            }
            else
            {
                setMessage('Game has been added');
                storage.storeToken( res.jwtToken );
            }
        }
        catch(e)
        {
            setMessage(e.toString());
        }

	};

    const searchGame = async event => 
    {
        event.preventDefault();
        		
        var storage = require('../tokenStorage.js');            
        var obj = {_id:userId,search:search.value,jwtToken:storage.retrieveToken()};
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch(bp.buildPath('api/searchGames'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var txt = await response.text();
            var res = JSON.parse(txt);
            var _results = res.results;
            var resultText = '';

            for( var i=0; i<_results.length; i++ )
            {
                resultText += _results[i];
                if( i < _results.length - 1 )
                {
                    resultText += ', ';
                }
            }

            setResults('Games(s) have been retrieved');
            setGameList(resultText);
        }
        catch(e)
        {
            console.log(e.toString());
            setResults(e.toString());
            storage.storeToken( res.jwtToken );
        }
    };

    return(
<div id="gameUIDiv">
  <br />
  <input type="text" id="searchText" placeholder="Game To Search For" 
    ref={(c) => search = c} />
  <button type="button" id="searchGameButton" class="buttons" 
    onClick={searchGame}> Search Game</button><br />
  <span id="gameSearchResult">{searchResults}</span>
  <p id="gameList">{gameList}</p><br /><br />
  <input type="text" id="gameText" placeholder="Game To Add" 
    ref={(c) => game = c} />
  <button type="button" id="addGameButton" class="buttons" 
    onClick={addGame}> Add Game </button><br />
  <span id="cardAddResult">{message}</span>
</div>
    );
}

export default GameUI;