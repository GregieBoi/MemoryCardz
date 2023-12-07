require('express');
require('mongodb');
const nodemailer = require('nodemailer');

exports.setApp = function (app, client) {
  /*
   * Basic Website 
   */

  app.post('/api/register', async (req, res, next) => {
    // incoming: first name, last name, username, email, password
    // outgoing: error

    // Gets new user info from front end
    const { firstName, lastName, username, email, password } = req.body;

    // Saves new user info to variables
    const newUser = { first_name: firstName, last_name: lastName, username: username, email: email, password: password, biography: '' };

    try {

      //Connects to the database
      const db = client.db('database');

      // Checks if there is already someone with that email or username
      const unCheck = await db.collection('users').find({ username: username }).toArray();
      const emCheck = await db.collection('users').find({ email: email }).toArray();

      if (Array.isArray(unCheck) && unCheck.length != 0) {

        ret = { error: "This username already exists." };
      } else if (Array.isArray(emCheck) && emCheck.length != 0) {

        ret = { error: "This email is already connected to an account." };
      } else {

        // Inserts the new user
        const result = await db.collection('users').insertOne(newUser);

        // Find and save the id
        const result2 = await db.collection('users').find({ username: username, password: password }).toArray();
        var id = result2[0]._id;

        // Creates new JWT
        const token = require("./createJWT.js");
        JWT = token.createToken(firstName, lastName, id);
        ret = { id: id, username: username, firstName: firstName, lastName: lastName, username: username, email: email, JWT };
      }

      // Error handling
    } catch (e) {
      error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, first name, last name, email, admin status, bio, followers, following, logs, reviews, favorites, and lists

    // Gets user login from front end
    const { username, password } = req.body;

    // Requests info from back end
    const db = client.db('database');
    const results = await db.collection('users').find({ username: username, password: password }).toArray();

    // Sets up variables for login
    var id = -1;
    var first = '';
    var last = '';
    var email = '';
    var bio = '';

    var flwg = [];
    var flwrs = [];
    var reviewed = [];
    var favs = [];
    var lists = [];


    var ret;

    if (results.length > 0) {
      // Saves variables from login
      id = results[0]._id;
      first = results[0].first_name;
      last = results[0].last_name;
      email = results[0].email;
      bio = results[0].biography;
      flwg = results[0].following;
      flwrs = results[0].followers;
      reviewed = results[0].reviewed_games;
      favs = results[0].favorite_games;
      lists = results[0].curated_lists;

      try {
        // Creates new JWT
        const token = require("./createJWT.js");
        var JWT = token.createToken(first, last, id);
        ret = { id: id, firstName: first, lastName: last, username: username, email: email, bio: bio, following: flwg, followers: flwrs, reviewed: reviewed, favorites: favs, lists: lists, JWT };

      } catch (e) {
        // Saves error;
        ret = { error: e.message }
      }
    } else {
      // Returns error
      ret = { error: "Login/Password incorrect" };
    }

    // Returns status
    res.status(200).json(ret);
  });

  /*
   * Get Specific (R)
   */
  app.post('/api/searchUserId', async (req, res, next) => {
    // incoming: id
    // outgoing: id, first name, last name, email, admin status, bio, followers, following, logs, reviews, favorites, lists

    // Gets search key from front end
    const { userId } = req.body;

    // Requests info from back end
    var ObjectId = require('mongodb').ObjectId;
    const db = client.db('database');
    const results = await db.collection('users').find({ _id: (new ObjectId(userId)) }).toArray();

    // Sets up variables for search
    var id = -1;
    var first = '';
    var last = '';
    var user = '';
    var email = '';
    var bio = '';

    var flwg = [];
    var flwrs = [];
    var reviewed = [];
    var favs = [];
    var lists = [];
    var liked = [];

    var reviewSpread = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var ret;

    try {

      if (results.length > 0) {
        // Saves variables from search
        id = results[0]._id;
        first = results[0].first_name;
        last = results[0].last_name;
        user = results[0].username;
        email = results[0].email;
        bio = results[0].biography;
        var flwg = results[0].following;
        var flwrs = results[0].followers;
        var reviewed = results[0].reviewed_games;
        var favs = results[0].favorite_games;
        var lists = results[0].curated_lists;
        var liked = results[0].liked_reviews;

        if (Array.isArray(reviewed)) {
          for (let i = 0; i < reviewed.length; i++) {
            const results = await db.collection('reviews').find({ _id: (new ObjectId(reviewed[i])) }).toArray();
            reviewSpread[results[0].rating] += 1;
          }
        }

        ret = { id: id, username: user, firstName: first, lastName: last, email: email, bio: bio, following: flwg, followers: flwrs, reviewed: reviewed, favorites: favs, lists: lists, liked: liked, reviewSpread: reviewSpread };

      } else {
        // Returns error
        ret = { error: "No user found" };
      }

      // Returns status
      res.status(200).json(ret);

    } catch (e) {
      // Saves error
      ret = { error: e.message };
    }

  });

  app.post('/api/searchGameId', async (req, res, next) => {
    // incoming: id
    // outgoing: id, title, developer, category, release, trending, reviews

    // Gets search key from front end
    const { gameId } = req.body;

    // Requests info from back end
    var ObjectId = require('mongodb').ObjectId;
    const db = client.db('database');
    const results = await db.collection('games').find({ _id: (new ObjectId(gameId)) }).toArray();

    // Sets up variables for search
    var id = ' ';
    var title = ' ';
    var developer = ' ';
    var category = ' ';
    var release = ' ';
    var trending = ' ';
    var description = ' ';
    var image = ' ';
    var igdbId = ' ';
    var platforms = [];
    var reviews = [];
    var favBy = [];
    var listList = [];
    var zeroStars = 0;
    var oneStar = 0;
    var twoStars = 0;
    var threeStars = 0;
    var fourStars = 0;
    var fiveStars = 0;
    var sixStars = 0;
    var sevenStars = 0;
    var eightStars = 0;
    var nineStars = 0;
    var tenStars = 0;

    var ratings = [];
    var ageRating = ' ';


    var ret;
    try {

      if (results.length > 0) {
        // Saves variables from search
        id = results[0]._id;
        title = results[0].title;
        developer = results[0].developer;
        category = results[0].category;
        release = results[0].release_date;
        trending = results[0].trending;
        description = results[0].description;
        image = results[0].image;
        igdbId = results[0].IGDB_Id;
        platforms = results[0].platforms;
        reviews = results[0].reviews;
        favBy = results[0].favorited_by;
        listList = results[0].list_list;

        ratings = results[0].ratings;
        ageRating = results[0].age_rating;


        zeroStars = results[0].zero_stars;
        oneStar = results[0].one_star;
        twoStars = results[0].two_stars;
        threeStars = results[0].three_stars;
        fourStars = results[0].four_stars;
        fiveStars = results[0].five_stars;
        sixStars = results[0].six_stars;
        sevenStars = results[0].seven_stars;
        eightStars = results[0].eight_stars;
        nineStars = results[0].nine_stars;
        tenStars = results[0].ten_stars;

        ret = { id: id, igdbId: igdbId, title: title, developer: developer, category: category, release: release, trending: trending, description: description, image: image, platforms: platforms, reviews: reviews, favoritedBy: favBy, listList: listList, ratings: ratings, ageRating: ageRating, zeroStars: zeroStars, oneStar: oneStar, twoStars: twoStars, threeStars: threeStars, fourStars: fourStars, fiveStars: fiveStars, sixStars: sixStars, sevenStars: sevenStars, eightStars: eightStars, nineStars: nineStars, tenStars: tenStars };

      } else {
        // Returns error
        ret = { error: "No game found" };
      }

    } catch (e) {
      // Saves error
      ret = { error: e.message };
    }

    // Returns status
    res.status(200).json(ret);
  });

  app.post('/api/searchListId', async (req, res, next) => {
    // incoming: id
    // outgoing: id, name, likes, ratings, games

    // Gets search key from front end
    const { listId } = req.body;

    // Requests info from back end
    var ObjectId = require('mongodb').ObjectId;
    const db = client.db('database');
    const results = await db.collection('lists').find({ _id: (new ObjectId(listId)) }).toArray();

    // Sets up variables for search
    var id = ' ';
    var name = ' ';
    var likes = ' ';
    var userId = ' ';
    var isRanked = false;
    var listRating = [];
    var gameList = [];


    var ret;
    try {

      if (results.length > 0) {
        // Saves variables from search
        id = results[0]._id;
        name = results[0].list_name;
        likes = results[0].likes;
        userId = results[0].user_id;
        isRanked = results[0].isRanked;
        listRating = results[0].list_rating;
        gameList = results[0].game_list;

        ret = { reviewId: id, userId: userId, name: name, likes: likes, isRanked: isRanked, listRating: listRating, gameList: gameList };

      } else {
        // Returns error
        ret = { error: "No list found" };
      }

    } catch (e) {
      // Saves error
      ret = { error: e.message };
    }


    // Returns status
    res.status(200).json(ret);
  });

  app.post('/api/searchReviewId', async (req, res, next) => {
    // incoming: id
    // outgoing: id, edit date, rating, review text, game id

    // Gets search key from front end
    const { reviewId } = req.body;

    // Requests info from back end
    var ObjectId = require('mongodb').ObjectId;
    const db = client.db('database');

    const results = await db.collection('reviews').find({ _id: (new ObjectId(reviewId)) }).toArray();

    var ret;
    try {

      if (results.length > 0) {
        // Saves variables from search

        ret = { id: results[0]._id, userId: results[0].user_id, editDate: results[0].edit_date, createDate: results[0].create_date, rating: results[0].rating, text: results[0].text_comment, gameId: results[0].game_id, isLog: results[0].is_log, likedBy: results[0].liked_by };

      } else {
        // Returns error
        ret = { error: "No game found" };
      }

    } catch (e) {
      // Saves error
      ret = { error: e.message };
    }


    // Returns status
    res.status(200).json(ret);
  });

  app.post('/api/searchGameIgdbId', async (req, res, next) => {
    // incoming: id
    // outgoing: id, title, developer, category, release, trending, reviews

    // Gets search key from front end
    const { igdbId } = req.body;

    // Requests info from back end
    var ObjectId = require('mongodb').ObjectId;
    const db = client.db('database');
    const resultsI = await db.collection('games').find({ IGDB_Id: `${igdbId}` }).toArray();
    var ret;
    if (resultsI.length > 0) {

      const results = await db.collection('games').find({ _id: (new ObjectId(resultsI[0]._id)) }).toArray();
      var ret;

      if (results.length > 0) {

        // Saves variables from search
        ret = {
          id: results[0]._id,
          title: results[0].title,
          developer: results[0].developer,
          category: results[0].category,
          release: results[0].release_date,
          trending: results[0].trending,
          description: results[0].description,
          image: results[0].image,
          platforms: results[0].platforms,
          reviews: results[0].reviews,
          favoritedBy: results[0].favorited_by,
          listList: results[0].list_list,
          IGDB_Id: `${igdbId}`,
          ratings: results[0].ratings,
          ageRating: results[0].age_rating,
          zeroStars: results[0].zero_stars,
          oneStar: results[0].one_star,
          twoStars: results[0].two_stars,
          threeStars: results[0].three_stars,
          fourStars: results[0].four_stars,
          fiveStars: results[0].five_stars,
          sixStars: results[0].six_stars,
          sevenStars: results[0].seven_stars,
          eightStars: results[0].eight_stars,
          nineStars: results[0].nine_stars,
          tenStars: results[0].ten_stars
        };
      } else {
        // Returns error
        ret = { error: "No game found (GameId)" };
      }

    } else {
      // Returns error
      ret = { error: "No game found (IGDBId)" };
    }

    // Returns status
    res.status(200).json(ret);
  });

  app.post('/api/searchGameIdIgdbId', async (req, res, next) => {
    // incoming: id
    // outgoing: id, title, developer, category, release, trending, reviews

    // Gets search key from front end
    const { igdbId } = req.body;

    // Requests info from back end
    const db = client.db('database');
    const results = await db.collection('games').find({ IGDB_Id: `${igdbId}` }).toArray();

    var ret;

    if (results.length > 0) {

      ret = { game: results[0] };

    } else {
      // Returns error
      ret = { error: "No game found" };
    }

    // Returns status
    res.status(200).json(ret);
  });

  /*
   * Search alls (R)
   */
  app.post('/api/searchUserUsername', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error

    // Sets up no error, and gets the search info
    var error = '';
    const { search } = req.body;

    // Makes sure something is being searched, then gets rid of mistakes
    if (!search) {
      res.status(400).json({ error: "Invalid search" });
      return;
    }
    var _search = search.trim();

    // Searches the database for users with that username or a simiar one
    const db = client.db('database');
    const results = await db.collection('users').find({ "username": { $regex: _search + '.*', $options: 'i' } }).toArray();

    // 
    var _ret = [];
    for (var i = 0; i < results.length; i++) {
      _ret.push(results[i]._id);
    }

    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
  });

  /*
   * Delete (D)
   */

  app.post('/api/deleteUserId', async (req, res, next) => {
    // incoming: id
    // outgoing: n/a

    // Gets user id from front end
    const { userId } = req.body;
    var error = '';

    var ret;

    try {

      // Requests info from back end
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');
      const results = await db.collection('users').find({ _id: (new ObjectId(userId)) }).toArray();

      var likes = results[0].liked_reviews;
      if (Array.isArray(likes)) {
        for (let i = 0; i < likes.length; i++) {

          await db.collection('reviews').updateOne({ _id: (new ObjectId(likes[i])) }, { $pull: { liked_by: userId } });
        }
      }

      var favorites = results[0].favorite_games;
      if (Array.isArray(favorites)) {
        for (let i = 0; i < favorites.length; i++) {

          await db.collection('games').updateOne({ _id: (new ObjectId(favorites[i])) }, { $pull: { favorited_by: userId } });
        }
      }

      // Unfollows all users
      var following = results[0].following;
      if (Array.isArray(following)) {
        for (let i = 0; i < following.length; i++) {

          //await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $pull: { following: followId } });
          await db.collection('users').updateOne({ _id: (new ObjectId(following[i])) }, { $pull: { followers: userId } });
        }
      }

      // Clears all followers
      var followers = results[0].followers;
      if (Array.isArray(followers)) {
        for (let i = 0; i < followers.length; i++) {

          await db.collection('users').updateOne({ _id: (new ObjectId(followers[i])) }, { $pull: { following: userId } });
        }
      }
      console.log("Done clearing followers");

      // Deletes all reviews created by the user
      var reviewed = results[0].reviewed_games;

      if (Array.isArray(reviewed)) {
        for (let i = 0; i < reviewed.length; i++) {
          console.log("All " + reviewed[i]);


          const review = await db.collection('reviews').find({ _id: (new ObjectId(reviewed[i])) }).toArray();
          console.log("Rev " + review[0].toString());

          if (Array.isArray(review[0].liked_by)) {
            for (let j = 0; j < review[0].liked_by.length; j++) {
              console.log(review[0].liked_by[j] + " " + review[0]._id.toString());
              await db.collection('users').updateOne({ _id: (new ObjectId(review[0].liked_by[j])) }, { $pull: { liked_reviews: review[0]._id.toString() } });
            }
          }

          var gameId = review[0].game_id;
          var rating = 0;
          try {
            rating = review[i].rating;
          } catch {

          }
          switch (rating) {
            case 0:
              await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { zero_stars: -1 } });
              break;
            case 1:
              await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { one_star: -1 } });
              break;
            case 2:
              await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { two_stars: -1 } });
              break;
            case 3:
              await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { three_stars: -1 } });
              break;
            case 4:
              await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { four_stars: -1 } });
              break;
            case 5:
              await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { five_stars: -1 } });
              break;
            case 6:
              await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { six_stars: -1 } });
              break;
            case 7:
              await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { seven_stars: -1 } });
              break;
            case 8:
              await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { eight_stars: -1 } });
              break;
            case 9:
              await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { nine_stars: -1 } });
              break;
            case 10:
              await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { ten_stars: -1 } });
              break;
          }

          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $pull: { reviews: reviewed[i] } });
          await db.collection('reviews').deleteOne({ _id: (new ObjectId(reviewed[i])) });
        }
      }

      // Deletes all lists created by the user
      var lists = results[0].curated_lists;
      if (Array.isArray(lists)) {

        // i is a list on the array lists index
        for (let i = 0; i < lists.length; i++) {

          const list = await db.collection('lists').find({ _id: (new ObjectId(lists[i])) }).toArray();

          try {
            if (Array.isArray(list[0].game_list)) {

              // j is a game index
              for (let j = 0; j < list[0].game_list.length; j++) {

                await db.collection('games').updateOne({ _id: (new ObjectId(list[0].game_list[j])) }, { $pull: { list_list: list[0]._id.toString() } });
              }
            }
          } catch {

          }


          await db.collection('lists').deleteOne({ _id: (new ObjectId(lists[i])) });
        }
      }

      // Deletes the user's account
      await db.collection('users').deleteOne({ _id: (new ObjectId(userId)) });

      ret = {};


    } catch (e) {
      // Saves error
      ret = { error: e.message };
    }

    // Returns status
    res.status(200).json(ret);
  });

  app.post('/api/deleteListId', async (req, res, next) => {
    // incoming: id
    // outgoing: n/a

    // Get list id from front end
    const { listId } = req.body;

    var ret;

    try {

      // Requests info from back end
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      // Gets list info
      const list = await db.collection('lists').find({ _id: (new ObjectId(listId)) }).toArray();

      if (Array.isArray(list[0].game_list)) {
        for (let i = 0; i < list[0].game_list.length; i++) {
          await db.collection('games').updateOne({ _id: (new ObjectId(list[0].game_list[i])) }, { $pull: { list_list: listId } });
        }
      }

      // Deletes from user
      await db.collection('users').updateOne({ _id: (new ObjectId(list[0].user_id)) }, { $pull: { curated_lists: listId } });

      // Deletes list
      await db.collection('lists').deleteOne({ _id: (new ObjectId(listId)) });


      ret = {};


    } catch (e) {
      // Saves error
      ret = { error: e.message };
    }

    // Returns status
    res.status(200).json(ret);
  });

  app.post('/api/deleteReviewId', async (req, res, next) => {
    // incoming: id
    // outgoing: n/a

    // Gets review id from front end
    const { reviewId } = req.body;
    var ret;

    try {

      // Requests info from back end
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      // Gets info on the review
      const review = await db.collection('reviews').find({ _id: (new ObjectId(reviewId)) }).toArray();
      userId = review[0].user_id;
      gameId = review[0].game_id;

      // Deletes likes and stars
      console.log(review);
      if (Array.isArray(review[0].liked_by)) {
        for (let i = 0; i < review[0].liked_by.length; i++) {
          console.log(review[0].liked_by[i] + " " + reviewId);
          await db.collection('users').updateOne({ _id: (new ObjectId(review[0].liked_by[i])) }, { $pull: { liked_reviews: reviewId } });
        }
      }

      switch (review[0].rating) {
        case 0:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { zero_stars: -1 } });
          break;
        case 1:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { one_star: -1 } });
          break;
        case 2:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { two_stars: -1 } });
          break;
        case 3:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { three_stars: -1 } });
          break;
        case 4:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { four_stars: -1 } });
          break;
        case 5:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { five_stars: -1 } });
          break;
        case 6:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { six_stars: -1 } });
          break;
        case 7:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { seven_stars: -1 } });
          break;
        case 8:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { eight_stars: -1 } });
          break;
        case 9:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { nine_stars: -1 } });
          break;
        case 10:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { ten_stars: -1 } });
          break;
      }

      // Deletes from the user
      await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $pull: { reviewed_games: reviewId } });
      await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $pull: { reviews: reviewId } });

      // Deletes the review
      await db.collection('reviews').deleteOne({ _id: (new ObjectId(reviewId)) });


      ret = {};


    } catch (e) {
      // Saves error
      ret = { error: e.message };
    }

    // Returns status
    res.status(200).json(ret);
  });

  /*
   * Create (C)
   */
  app.post('/api/addList', async (req, res, next) => {
    // incoming: user id, list name
    // outgoing: n/a

    // Gets new list info from front end
    const { userId, listName } = req.body;

    // Saves new list info to variables
    const newList = { user_id: userId, list_name: listName };
    var error = '';

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      // Inserts new list
      const result = await db.collection('lists').insertOne(newList);

      // Adds new list to the relevant user
      await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $push: { curated_lists: result.insertedId.toString() } });

      ret = { listId: result.insertedId.toString() };

    } catch (e) {
      error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  app.post('/api/addReview', async (req, res, next) => {
    // incoming: user id, game id
    // outgoing: error

    // Gets new review info from front end
    const { userId, gameId, createDate } = req.body;

    // Saves new review info to variables
    const newReview = { user_id: userId, game_id: gameId, is_log: true, create_date: createDate };

    var error = '';
    var reviewId;

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      // Checks if it already exists
      const review = await db.collection('users').find({ _id: (new ObjectId(userId)) }).toArray();

      // Just trying to push
      var needsReview = true;

      if (Array.isArray(review[0].reviewed_games)) {
        for (let i = 0; i < review[0].reviewed_games.length; i++) {

          const reviewInd = await db.collection('reviews').find({ _id: (new ObjectId(review[0].reviewed_games[i])) }).toArray();
          if (reviewInd[0].game_id == gameId) {
            needsReview = false;
            reviewId = reviewInd[0]._id.toString();
          }
        }
      }

      if (needsReview) {
        // Inserts new review into database
        const result = await db.collection('reviews').insertOne(newReview);
        console.log(result);
        console.log(result.insertedId.toString());

        // Inserst new review into the user's table as a log (there is no text yet)
        const uParent = await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $push: { reviewed_games: result.insertedId.toString() } });
        const gParent = await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $push: { reviews: result.insertedId.toString() } });

        // Logs that another game has been reviewed
        const global = await db.collection('global').find({ _id: (new ObjectId("6565504e9adeea98e2a09680")) }).toArray();
        if (Array.isArray(global[0].popular) && global[0].popular.length >= 10) {

          await db.collection('global').updateOne({ _id: (new ObjectId("6565504e9adeea98e2a09680")) }, { $pop: { popular: -1 } });
        }
        await db.collection('global').updateOne({ _id: (new ObjectId("6565504e9adeea98e2a09680")) }, { $push: { popular: gameId } });

        ret = { reviewId: result.insertedId.toString() };
      } else {
        ret = { error: "Review already exists", reviewId: reviewId };
      }

    } catch (e) {
      error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  app.post('/api/addGame', async (req, res, next) => {
    // incoming: title, developer, category, release date, igdb id
    // outgoing: error

    // Gets new game info from front end (igdb database)
    const { title, developer, category, releaseDate, igdbId, description, image, ageRating } = req.body;

    // Saves new game info to variables
    const newGame = { title: title, developer: developer, category: category, release_date: releaseDate, IGDB_Id: igdbId, description: description, image: image, age_rating: ageRating };

    try {
      const db = client.db('database');
      const result = await db.collection('games').findOne({ IGDB_Id: igdbId });
      if (result) {
        res.status(200).json({ gameId: result._id.toString() });
        return;
      }
    } catch (e) {

    }
    try {
      // Connects to database and adds game
      const db = client.db('database');
      const result = await db.collection('games').insertOne(newGame);

      ret = { gameId: result.insertedId.toString() };

    } catch (e) {
      error = e.toString();
      ret = { error: e.message() };
    }

    res.status(200).json(ret);
  });

  /*
   * Update information (U)
   */

  app.post('/api/updateUserInfo', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { userId, firstName, lastName, username, email, bio } = req.body;

    // Saves new list info to variables
    const userInfo = { first_name: firstName, last_name: lastName, username: username, email: email, biography: bio };
    var error = '';

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      const result = await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $set: userInfo });

      ret = "";

    } catch (e) {
      error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  app.post('/api/updateReviewInfo', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { gameId, reviewId, userId, editDate, rating, textComment, isLog } = req.body;

    // Saves new list info to variables
    const reviewInfo = { user_id: userId, edit_date: editDate, rating: rating, text_comment: textComment, is_log: isLog };
    var error = '';

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      const review = await db.collection('reviews').find({ _id: (new ObjectId(reviewId)) }).toArray();

      switch (review[0].rating) {
        case 0:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { zero_stars: -1 } });
          break;
        case 1:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { one_star: -1 } });
          break;
        case 2:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { two_stars: -1 } });
          break;
        case 3:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { three_stars: -1 } });
          break;
        case 4:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { four_stars: -1 } });
          break;
        case 5:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { five_stars: -1 } });
          break;
        case 6:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { six_stars: -1 } });
          break;
        case 7:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { seven_stars: -1 } });
          break;
        case 8:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { eight_stars: -1 } });
          break;
        case 9:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { nine_stars: -1 } });
          break;
        case 10:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { ten_stars: -1 } });
          break;
      }

      switch (rating) {
        case 0:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { zero_stars: 1 } });
          break;
        case 1:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { one_star: 1 } });
          break;
        case 2:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { two_stars: 1 } });
          break;
        case 3:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { three_stars: 1 } });
          break;
        case 4:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { four_stars: 1 } });
          break;
        case 5:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { five_stars: 1 } });
          break;
        case 6:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { six_stars: 1 } });
          break;
        case 7:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { seven_stars: 1 } });
          break;
        case 8:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { eight_stars: 1 } });
          break;
        case 9:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { nine_stars: 1 } });
          break;
        case 10:
          await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $inc: { ten_stars: 1 } });
          break;
      }

      await db.collection('reviews').updateOne({ _id: (new ObjectId(reviewId)) }, { $set: reviewInfo });

      ret = "";

    } catch (e) {
      error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  app.post('/api/validatePassword', async (req, res, next) => {
    // incoming: id
    // outgoing: id, first name, last name, email, admin status, bio, followers, following, logs, reviews, favorites, lists

    // Gets search key from front end
    const { userId, passwordAttempt } = req.body;
    var error = '';

    // Requests info from back end
    var ObjectId = require('mongodb').ObjectId;
    const db = client.db('database');
    const results = await db.collection('users').find({ _id: (new ObjectId(userId)) }).toArray();

    var ret;

    if (results.length > 0) {
      // Saves variables from search
      password = results[0].password;
      if (passwordAttempt == password) {
        ret = { correct: true };
      } else {
        ret = { correct: false };
      }

    } else {
      // Returns error
      ret = { error: "No user found" };
    }

    // Returns status
    res.status(200).json(ret);
  });

  app.post('/api/updatePassword', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { userId, newPassword } = req.body;

    // Saves new list info to variables
    const userInfo = { _id: userId, password: newPassword };
    var error = '';

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $set: { password: newPassword } });

      ret = "";

    } catch (e) {
      error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  /*
   * Lists (U)
   */

  app.post('/api/updateListName', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { listId, listName } = req.body;

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      const result = await db.collection('lists').updateOne({ _id: (new ObjectId(listId)) }, { $set: { list_name: listName } });

      ret = "";

    } catch (e) {
      var error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  app.post('/api/listAddGame', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { listId, gameId } = req.body;

    // Saves new list info to variables

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      const listReq = await db.collection('lists').find({ _id: (new ObjectId(listId)) }).toArray();

      var needsAdd = true;

      if (Array.isArray(listReq[0].game_list)) {
        for (let i = 0; i < listReq[0].game_list.length; i++) {

          if (listReq[0].game_list[i] == gameId) {
            needsAdd = false;
          }
        }
      }

      if (needsAdd) {
        var nextRating = 1;
        if (Array.isArray(listReq[0].game_list)) {
          nextRating = listReq[0].game_list.length + 1;
        }

        await db.collection('lists').updateOne({ _id: (new ObjectId(listId)) }, { $push: { game_list: gameId, list_rating: nextRating } });
        await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $push: { list_list: listId } });


        ret = "";
      } else {
        ret = { error: "Game is already on list" };
      }

    } catch (e) {
      var error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  app.post('/api/listDeleteGame', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { listId, gameId } = req.body;

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      const listReq = await db.collection('lists').find({ _id: (new ObjectId(listId)) }).toArray();

      var delIndex = 0;
      var delVal = 1;
      var ratings = [];

      if (Array.isArray(listReq[0].game_list)) {

        for (let i = 0; i < listReq[0].game_list.length; i++) {
          if (listReq[0].game_list[i] == gameId) {
            delIndex = i;
          }
        }

        delVal = listReq[0].list_rating[delIndex];

        ratings = ratings.concat(listReq[0].list_rating.slice(0, delIndex), listReq[0].list_rating.slice(delIndex + 1, listReq[0].list_rating.length));

        for (let i = 0; i < listReq[0].game_list.length; i++) {
          if (ratings[i] > delVal) {
            ratings[i] = ratings[i] - 1;
          }
        }
      }

      await db.collection('lists').updateOne({ _id: (new ObjectId(listId)) }, { $pull: { game_list: gameId }, $set: { list_rating: ratings } });
      await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $pull: { list_list: listId } });

      ret = "";

    } catch (e) {
      var error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  /*
   * Stats (U)
   */
  app.post('/api/followUser', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { userId, followId } = req.body;
    var error = '';

    if (userId != followId) {
      try {
        // Connects to database
        var ObjectId = require('mongodb').ObjectId;
        const db = client.db('database');

        var needsFollow = true;

        const results = await db.collection('users').find({ _id: (new ObjectId(userId)) }).toArray();

        if (Array.isArray(results[0].following)) {
          for (let i = 0; i < results[0].following.length; i++) {

            const followeeInd = await db.collection('users').find({ _id: (new ObjectId(results[0].following[i])) }).toArray();
            if (followeeInd[0]._id == followId) {
              needsFollow = false;
            }
          }
        }

        if (needsFollow) {

          await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $push: { following: followId } });
          await db.collection('users').updateOne({ _id: (new ObjectId(followId)) }, { $push: { followers: userId } });

          ret = "";
        } else {
          ret = { error: "User is already following this user" };
        }

      } catch (e) {
        error = e.toString();
        ret = { error: e.message };
      }
    } else {
      ret = { error: "User cannot follow themself" };
    }

    res.status(200).json(ret);
  });

  app.post('/api/unfollowUser', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { userId, followId } = req.body;
    var error = '';

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $pull: { following: followId } });
      await db.collection('users').updateOne({ _id: (new ObjectId(followId)) }, { $pull: { followers: userId } });

      ret = "";

    } catch (e) {
      error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  app.post('/api/addFavorite', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { userId, gameId } = req.body;
    var error = '';


    var ObjectId = require('mongodb').ObjectId;
    const db = client.db('database');
    const results = await db.collection('users').find({ _id: (new ObjectId(userId)) }).toArray();
    var found = false;
    var full = Array.isArray(results[0].favorite_games);

    if (Array.isArray(results) && results.length > 0 && Array.isArray(results[0].favorite_games)) {

      if (results[0].favorite_games.length < 4) {
        found = results[0].favorite_games.includes(gameId);
        full = false;
      }
    }

    // Checks if it's already favorited
    if (found != true && full != true) {
      try {
        // Connects to database
        var ObjectId = require('mongodb').ObjectId;
        const db = client.db('database');

        await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $push: { favorite_games: gameId } });
        await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $push: { favorited_by: userId } });

        ret = "";

      } catch (e) {
        error = e.toString();
        ret = { error: e.message };
      }
    } else {
      if (full == true) {

        ret = { error: "Your favorites list is already full" };
      } else {

        ret = { error: "This game is already on the favorites list" };
      }
    }

    res.status(200).json(ret);
  });

  app.post('/api/deleteFavorite', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { userId, gameId } = req.body;
    var error = '';

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $pull: { favorite_games: gameId } });
      await db.collection('games').updateOne({ _id: (new ObjectId(gameId)) }, { $pull: { favorited_by: userId } });

      ret = "";

    } catch (e) {
      error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  app.post('/api/addLike', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { userId, reviewId } = req.body;
    var error = '';

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');
      var needsLike = true;

      const results = await db.collection('reviews').find({ _id: (new ObjectId(reviewId)) }).toArray();

      if (Array.isArray(results[0].liked_by)) {
        for (let i = 0; i < results[0].liked_by.length; i++) {
          if (results[0].liked_by[i] == userId) {
            needsLike = false;
          }
        }
      }

      if (needsLike) {

        await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $push: { liked_reviews: reviewId } });
        await db.collection('reviews').updateOne({ _id: (new ObjectId(reviewId)) }, { $push: { liked_by: userId } });

        ret = "";
      } else {
        ret = { error: "User is already liking this post" };
      }

    } catch (e) {
      error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  app.post('/api/deleteLike', async (req, res, next) => {
    // incoming: 
    // outgoing: 

    // Gets new list info from front end
    const { userId, reviewId } = req.body;
    var error = '';

    try {
      // Connects to database
      var ObjectId = require('mongodb').ObjectId;
      const db = client.db('database');

      await db.collection('users').updateOne({ _id: (new ObjectId(userId)) }, { $pull: { liked_reviews: reviewId } });
      await db.collection('reviews').updateOne({ _id: (new ObjectId(reviewId)) }, { $pull: { liked_by: userId } });

      ret = "";

    } catch (e) {
      error = e.toString();
      ret = { error: e.message };
    }

    res.status(200).json(ret);
  });

  /*
   * Social (R) 
   */

  app.post('/api/latestFollowingReviews', async (req, res, next) => {
    // incoming: id
    // outgoing: id, first name, last name, email, admin status, bio, followers, following, logs, reviews, favorites, lists

    // Gets search key from front end
    const { userId } = req.body;
    var error = '';

    // Requests info from back end
    var ObjectId = require('mongodb').ObjectId;
    const db = client.db('database');
    const results = await db.collection('users').find({ _id: (new ObjectId(userId)) }).toArray();

    // Sets up variables for search
    var flwrs = [];

    var ret;

    if (results.length > 0) {
      // Saves variables from search
      var flwrs = results[0].following;
      var flwrsRecent = [];

      // Checks if there are mutiple followers
      if (Array.isArray(flwrs)) {

        // Goes through followers, getting their most recent reviewed
        for (let i = 0; i < flwrs.length; i++) {
          let followee = await db.collection('users').find({ _id: (new ObjectId(flwrs[i])) }).toArray();

          console.log(followee[0]._id);

          try {
            flwrsRecent.push(followee[0].reviewed_games[followee[0].reviewed_games.length - 1]);
          } catch {
          }
        }
      } else {

        let followee = await db.collection('users').find({ _id: (new ObjectId(flwrs)) }).toArray();

        try {
          flwrsRecent.push(followee[0].reviewed_games[followee[0].reviewed_games.length - 1]);
        } catch {
        }
      }

      ret = { reviews: flwrsRecent };

    } else {
      // Returns error
      ret = { error: "Nothing found" };
    }

    // Returns status
    res.status(200).json(ret);
  });

  app.post('/api/latestReviews', async (req, res, next) => {
    // incoming: id
    // outgoing: id, first name, last name, email, admin status, bio, followers, following, logs, reviews, favorites, lists

    // Gets search key from front end
    var error = '';

    // Requests info from back end
    var ObjectId = require('mongodb').ObjectId;
    const db = client.db('database');
    const results = await db.collection('global').find({ _id: (new ObjectId("6565504e9adeea98e2a09680")) }).toArray();

    // Sets up variables for search
    var popular = [];

    var ret;

    if (results.length > 0) {
      // Saves variables from search

      popular = results[0].popular;

      ret = { popular: popular };

    } else {
      // Returns error
      ret = { error: "Nothing found" };
    }

    // Returns status
    res.status(200).json(ret);
  });

  /*
   * External (R) 
   */

  app.post('/api/searchIGDBGames', async (req, res, next) => {
    const { query } = req.body;
    const apiKey = '92hgc1hks3axm39nqurfsd9g57slbv';
    const authKey = 'Bearer olri728cp8oz5wajq55y1t07ses589';
    const baseUrl = 'https://api.igdb.com/v4/games';
    const coversUrl = 'https://api.igdb.com/v4/covers';
    const response = await fetch(baseUrl, {
      method: 'POST',
      body: `fields cover,summary,name,first_release_date,category,involved_companies.developer,involved_companies.company.name,age_ratings.rating,genres.name; search "${query}"; limit 10;`,
      headers: {
        'Content-Type': 'application/json',
        'Client-ID': apiKey,
        'Authorization': authKey,
      }
    });
    const games = await response.json();
    for (const game of games) {
      if (!game.cover) {
        continue;
      }
      const response = await fetch(coversUrl, {
        method: 'POST',
        body: `fields url,image_id; where id=${game.cover};`,
        headers: {
          'Content-Type': 'application/json',
          'Client-ID': apiKey,
          'Authorization': authKey,
        }
      })
      const images = await response.json();
      game.cover_url = 'https://images.igdb.com/igdb/image/upload/t_cover_big/' + `${images[0]?.image_id}` + '.jpg';
    }
    res.status(200).json(games);
  });

  app.post('/api/searchIGDBSummary', async (req, res, next) => {
    const { id } = req.body;
    var field = "fields summary; where id = " + id + "; limit 1;";
    
    console.log("searching for id", id);
    const apiKey = '92hgc1hks3axm39nqurfsd9g57slbv';
    const authKey = 'Bearer olri728cp8oz5wajq55y1t07ses589';
    const baseUrl = 'https://api.igdb.com/v4/games';
    const response = await fetch(baseUrl, {
      method: 'POST',
      body: `fields summary; where id = ${id};`,
      headers: {
        'Content-Type': 'application/json',
        'Client-ID': apiKey,
        'Authorization': authKey,
      }
    });
    const results = await response.json();
    console.log(results, "summary is foihgfsokghfkgh");
    res.status(200).json(results?.[0]);
  });

  app.post('/api/emailVerify', async (req, res, next) => {
    const { verificationToken, email } = req.body;

    console.log('the email password is:', process.env.EMAIL_PASSWORD);

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email provider
      auth: {
        user: 'memorycardz.project@gmail.com', // Replace with your email
        pass: process.env.EMAIL_PASSWORD // Replace with your email password
      }
    });

    console.log('sending to email:', email);

    // Email content
    const mailOptions = {
      from: '"MemoryCardz" <memorycardz.project@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `MemoryCardz Account Verification Code`, // Subject line
      html: `
                <p>Hello,</p>
                <p>Your MemoryCardz verification code is: <strong>${verificationToken}</strong></p>
              `
    };

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent');
      ret = "";
    } catch (error) {
      console.log('Error sending email: ', error);
      ret = { error: error };
    }

    res.status(200).json(ret);
  });

  app.post('/api/emailReset', async (req, res, next) => {
    const { verificationToken, email } = req.body;

    console.log('the verificationToken is: ', verificationToken);
    console.log('the email password is:', process.env.EMAIL_PASSWORD);

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email provider
      auth: {
        user: 'memorycardz.project@gmail.com', // Replace with your email
        pass: process.env.EMAIL_PASSWORD // Replace with your email password
      }
    });

    console.log('sending to email:', email);

    // Email content
    const mailOptions = {
      from: '"MemoryCardz" <memorycardz.project@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `MemoryCardz Account Password Reset Code`, // Subject line
      html: `
                <p>Hello,</p>
                <p>Your MemoryCardz password reset code is: <strong>${verificationToken}</strong></p>
              `
    };

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent');
      ret = "";
    } catch (error) {
      //console.error('Error sending email: ', error);
      console.log('Error sending email: ', error);
      ret = { error: error };
    }

    res.status(200).json(ret);
  });

  app.post('/api/changePassword', async (req, res, next) => {
    // incoming: email, newPassword
    // outgoing: success message or error

    // Gets user input from front end
    const { email, newPassword } = req.body;

    console.log('the new email is: ', email, ' and the new password is: ', newPassword);

    try {
      // Connects to the database
      const db = client.db('database');

      // Checks if the user with the provided email exists
      const user = await db.collection('users').findOne({ email: email });

      if (user) {
        // Updates the user's password with the new password
        await db.collection('users').updateOne(
          { email: email },
          { $set: { password: newPassword } }
        );

        // Sends success message
        res.status(200).json({ success: "Password changed successfully." });
      } else {
        // Returns error if the user with the provided email is not found
        res.status(200).json({ error: "User not found with the provided email." });
      }

    } catch (e) {
      // Returns error if there is any issue with the database operation
      res.status(200).json({ error: e.message });
    }
  });

  app.post('/api/emailCheck', async (req, res, next) => {
    // incoming: email
    // outgoing: exists (true/false) or error

    // Gets user input from front end
    const { email } = req.body;

    try {
      // Connects to the database
      const db = client.db('database');

      // Checks if the user with the provided email exists
      const user = await db.collection('users').findOne({ email: email });

      // Sends response based on whether the email exists or not
      if (user) {
        res.status(200).json({ exists: true });
      } else {
        res.status(200).json({ exists: false });
      }

    } catch (e) {
      // Returns error if there is any issue with the database operation
      res.status(200).json({ error: e.message });
    }
  });
};