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


router.post("/search/twitter", (req, res, next)=>{
	const oauth2 = new OAuth2(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);
	oauth2.getOAuthAccessToken('', {
	    'grant_type': 'client_credentials'
	  }, (e, access_token) =>{
	      console.log(access_token); //string that we can use to authenticate request

				var options = {
				 hostname: 'api.twitter.com',
				 path: '/1.1/search/tweets.json?q=%23' + req.body.hashtag + "&result_type=mixed",
				 headers: {
						 Authorization: 'Bearer ' + access_token
				 }
			 	};
				https.get(options, (result)=>{
						var buffer = '';
					  result.setEncoding('utf8');
					  result.on('data', (data)=>{
					    buffer += data;
					  });
					  result.on('end', ()=>{
					    var tweets = JSON.parse(buffer);
							res.status(200).json(tweets);
					  });
					});
				});

});




router.post("/search/youtube", (req, res, next)=> {
  console.log(req.body.search);
  //sending the search query to the google api and returning the results
  const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&type=video&order=viewCount&q="+req.body.search+"&key="+process.env.YOUTUBE_KEY;
  request(url, (err, resp, body)=> {
     body = JSON.parse(body);
     if (err) res.status(401).json({message: "error"});
      else res.status(200).json(body);
 });

});


router.post("/search/reddit", (req, res, next)=> {
	const url = "https://www.reddit.com/search.json?q=%23"+ req.body.hashtag + "&sort=top&t=week";
	request(url, (err, resp, body)=> {
     body = JSON.parse(body);
     console.log(body);
     if (err) res.status(401).json({message: "error"});
      else res.status(200).json(body);
 	});

});

router.post("/search/tumblr", (req, res, next)=>{
	console.log(req.body.search);
	//sending the search query to the google api and returning the results
	const url = "https://api.tumblr.com/v2/tagged?tag="+ req.body.hashtag +"&api_key="+ process.env.TUMBLR_KEY;
	request(url, (err, resp, body)=> {
		 body = JSON.parse(body);
		 if (err) res.status(401).json({message: "error"});
			else res.status(200).json(body);
 });

});

module.exports = router;
