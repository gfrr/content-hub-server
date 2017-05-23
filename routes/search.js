const express           = require('express');
const router            = express.Router();
const jwt               = require('jsonwebtoken');
const jwtOptions        = require('../config/jwtOptions');
const User              = require("../models/user");
const dotenv            = require("dotenv");
const request           = require("request");
dotenv.config();
dotenv.load();





router.post("/search", (req, res, next)=> {
  console.log(req.body.search);
  //sending the search query to the google api and returning the results
  const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&order=viewCount&q="+req.body.search+"&key="+process.env.YOUTUBE_KEY;
  request(url, function(err, resp, body) {
     body = JSON.parse(body);
     console.log(body);
     if (err) res.status(401).json({message: "error"});
      else res.status(200).json(body);
 });

});


module.exports = router;
