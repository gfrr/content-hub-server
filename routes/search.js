const express           = require('express');
const router            = express.Router();
const jwt               = require('jsonwebtoken');
const jwtOptions        = require('../config/jwtOptions');
const User              = require("../models/user");
const dotenv            = require("dotenv");
const request           = require("request");
const OAuth2 						= require('oauth').OAuth2;
const https 						= require('https');
dotenv.config();
dotenv.load();



// const Twitter           = require('twitter-node-client').Twitter;



// //Callback functions
// 	const error = function (err, response, body) {
//     	console.log('ERROR [%s]', err);
// 	};
// 	const success = function (data) {
//     	console.log('Data [%s]', data);
// 	};
//
// const twitter = new Twitter();
router.get("/test", (req, res, next)=>{
	const oauth2 = new OAuth2(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);
	oauth2.getOAuthAccessToken('', {
	    'grant_type': 'client_credentials'
	  }, (e, access_token) =>{
	      console.log(access_token); //string that we can use to authenticate request

				var options = {
				 hostname: 'api.twitter.com',
				 path: '/1.1/search/tweets.json?q=%40twitterapi',
				 headers: {
						 Authorization: 'Bearer ' + access_token
				 }
			 	};
				https.get(options, (result)=>{
					  // result.setEncoding('utf8');
  					// result.on('data', (data)=>{
    				// console.log(data); //the response!
						// res.status(200).json(data);
  					// });
						var buffer = '';
					  result.setEncoding('utf8');
					  result.on('data', (data)=>{
					    buffer += data;
					  });
					  result.on('end', ()=>{
					    var tweets = JSON.parse(buffer);
					    console.log(tweets); // the tweets!
							res.status(200).json(tweets);
					  });
					});
	});

});




router.post("/search", (req, res, next)=> {
  console.log(req.body.search);
  //sending the search query to the google api and returning the results
  const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&order=viewCount&q="+req.body.search+"&key="+process.env.YOUTUBE_KEY;
  request(url, (err, resp, body)=> {
     body = JSON.parse(body);
     console.log(body);
     if (err) res.status(401).json({message: "error"});
      else res.status(200).json(body);
 });

});

// router.get("/tweet", (req, res, next)=> {
//   twitter.getSearch({'q':'#haiku','count': 10}, error, success);
// });

module.exports = router;
