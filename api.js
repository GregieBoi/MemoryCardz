require('express');
require('mongodb');

exports.setApp = function ( app, client ){
    /*
     * User creation 
     */

    app.post('/api/register', async (req, res, next) =>{
      // incoming: first name, last name, username, password
      // outgoing: error
        
      // Gets new user info from front end
      const { firstName, lastName, username, password } = req.body;
    
      // Saves new user info to variables
      const newUser = {first_name:firstName,last_name:lastName,username:username,password:password};
      var error = '';
    
      try{
        // Connects to database
        const db = client.db('database');
        const result = await db.collection('users').insertOne(newUser);

        try{
        const result2 = await db.collection('users').find({username:username,password:password}).toArray();
        var id = result2[0].id;
        
        // Creates new JWT
        const token = require("./createJWT.js");
        ret = token.createToken( firstName, lastName, id );

        }catch(e){
        error = e.toString();
        ret = {error:e.message()};
        }

      }catch(e){
        error = e.toString();
        ret = {error:e.message()};
      }

      res.status(200).json(ret);
    });
    
    app.post('/api/login', async (req, res, next) => {
      // incoming: login, password
      // outgoing: id, firstName, lastName, error
    
      // Gets user login from front end
      const { username, password } = req.body;
      var error = '';
    
      // Requests info from back end
      const db = client.db('database');
      const results = await db.collection('users').find({username:username,password:password}).toArray();

      console.log(results);

      // Sets up variables for login
      var id = -1;
      var first = '';
      var last = '';
      var email = '';
      var admin = '';
      var bio = '';
      
      var flwg = [];
      var flwrs = [];
      var logged = [];
      var reviewed = [];
      var favs = [];
      var lists = [];
    

      var ret;
    
      if( results.length > 0 ){
        // Saves variables from login
        id = results[0]._id;
        first = results[0].first_name;
        last = results[0].last_name;
        email = results[0].email;
        admin = results[0].is_admin;
        bio = results[0].biography;
        flwg = results[0].following;
        flwrs = results[0].followers;
        logged = results[0].logged_games;
        reviewed = results[0].reviewed_games;
        favs = results[0].favorite_games;
        lists = results[0].curated_lists;

        try{
          /*
          // Creates new JWT
          const token = require("./createJWT.js");
          ret = token.createToken( first, last, id );
          */

          
          // Creates new JWT
          const token = require("./createJWT.js");
          var tok =token.createToken( first, last, id );
          ret = tok;
          

        }catch(e){
          // Saves error
          ret = {error:e.message};
        }
      }else{
        // Returns error
        ret = {error:"Login/Password incorrect"};
      }
    
      // Returns status
      res.status(200).json(ret);
    });
    
    /*
     * User table access
     */





    /*
     * Games table access
     */

    app.post('/api/addGame', async (req, res, next) => {
      // incoming: userId, color
      // outgoing: error
        
      //console.log("ret is: ", ret);
      var token = require('./createJWT.js');
      const { userId, game, jwtToken } = req.body;

      try{
        if( token.isExpired(jwtToken)){
          var r = {error:'The JWT is no longer valid', jwtToken: ''};
          res.status(200).json(r);
          return;
        }
      }catch(e){
        console.log(e.message);
        var r = {error:e.message, jwtToken: ''};
        res.status(200).json(r);
        return;
      }
    
      const newGame = {title:game,_id:userId};
      console.log("the new game is: ", newGame);
      var error = '';
    
      try{
        const db = client.db('database');
        const result = db.collection('games').insertOne(newGame);
      }catch(e){
        error = e.toString();
      }
    
      var refreshedToken = null;
      try{
        refreshedToken = token.refresh(jwtToken);
        console.log("The refreshed token is: ", refreshedToken);
      }catch(e){
        console.log(e.message);
      }
    
      var ret = { error: '', jwtToken: refreshedToken };
      res.status(200).json(ret);
    });

    app.post('/api/searchGames', async (req, res, next) => 
    {
      // incoming: userId, search
      // outgoing: results[], error
    
      var error = '';
    
      const { userId, search } = req.body;

      console.log("the search is: ", search);
    
      var _search = search.trim();
      
      const db = client.db('database');
      const results = await db.collection('games').find({"title":{$regex:_search+'.*', $options:'i'}}).toArray();
      
      var _ret = [];
      for( var i=0; i<results.length; i++ ){
        _ret.push( results[i].title );
      }
      
      var ret = {results:_ret, error:error};
      res.status(200).json(ret);
    });
    

    /*
     * Search given ID
     */
    app.post('/api/searchUsersId', async (req, res, next) => {
      // incoming: login, password
      // outgoing: id, firstName, lastName, error
    
      // Gets user login from front end
      const { userId } = req.body;
      var error = '';
    
      // Requests info from back end
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');
      const results = await db.collection('users').find({_id:(new ObjectId(userId))}).toArray();

      // Sets up variables for login
      var id = -1;
      var first = '';
      var last = '';
      var email = '';
      var admin = '';
      var bio = '';
      /*
      var flwg;
      var flwrs;
      var logged;
      var reviewed;
      var favs;
      var lists;
      */

      var ret;
    
      if( results.length > 0  ){
        // Saves variables from login
        id = results[0]._id;
        first = results[0].first_name;
        last = results[0].last_name;
        email = results[0].email;
        admin = results[0].is_admin;
        bio = results[0].biography;
        var flwg = results[0].following;
        var flwrs = results[0].followers;
        var logged = results[0].logged_games;
        var reviewed = results[0].reviewed_games;
        var favs = results[0].favorite_games;
        var lists = results[0].curated_lists;

        try{
          /*
          // Creates new JWT
          const token = require("./createJWT.js");
          ret = token.createToken( first, last, id );
          */

          ret = {id:id, firstName:first, lastName:last, email:email, isAdmin:admin, bio:bio, following:flwg, followers:flwrs, logged:logged, reviewed:reviewed, favorites:favs, lists:lists};
          

        }catch(e){
          // Saves error
          ret = {error:e.message};
        }
      }else{
        // Returns error
        ret = {error:"No user found"};
      }
    
      // Returns status
      res.status(200).json(ret);
    });

    app.post('/api/searchGamesId', async (req, res, next) => {
      // incoming: login, password
      // outgoing: id, firstName, lastName, error
    
      // Gets user login from front end
      const { gameId } = req.body;
      var error = '';
    
      // Requests info from back end
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');
      const results = await db.collection('games').find({_id:(new ObjectId(gameId))}).toArray();

      // Sets up variables for login
      var id = ' ';
      var title = ' ';
      var developer = ' ';
      var category = ' ';
      var release = ' ';
      var trending = ' ';
      //var reviews;
    

      var ret;
    
      if( results.length > 0 ){
        // Saves variables from login
        id = results[0]._id;
        title = results[0].title;
        developer = results[0].developer;
        category = results[0].category;
        release = results[0].release_date;
        trending = results[0].trending;
        var reviews = results[0].reviews;

        try{
          /*
          // Creates new JWT
          const token = require("./createJWT.js");
          ret = token.createToken( first, last, id );
          */

          ret = {id:id, title:title, developer:developer, category:category, release:release, trending:trending, reviews:reviews};
          

        }catch(e){
          // Saves error
          ret = {error:e.message};
        }
      }else{
        // Returns error
        ret = {error:"No game found"};
      }
    
      // Returns status
      res.status(200).json(ret);
    });
}
//a