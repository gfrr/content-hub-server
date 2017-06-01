const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtOptions = require('../config/jwtOptions');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("../config/passport.js");


router.post("/login", function(req, res) {
  console.log(req.body.username, req.body.password);
  if (req.body.username && req.body.password) {
    const username = req.body.username;
    const password = req.body.password;


    if (username === "" || password === "") {
      res.status(401).json({
        message: "fill up the fields"
      });
      return;
    }

    User.findOne({
      "username": username
    }, (err, user) => {
      console.log("called");
      if (!user) res.status(401).json({
        message: "no such user found"
      });
      else {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (!isMatch) res.status(401).json({
            message: "passwords did not match"
          });
          else {
            console.log('user', user);
            const payload = {
              id: user._id,
              user: user.username
            };
            const token = jwt.sign(payload, jwtOptions.secretOrKey);
            console.log("token", token);
            res.json({
              message: "ok",
              token: token,
              user: user
            });
          }
        });
      }
    });
  }
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({
      message: "Provide username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.status(400).json({
        message: 'user exist'
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err, user) => {
      if (err) res.status(400).json({
        message: err
      });
      else {
        const payload = {
          id: user._id,
          user: user.username
        };
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({
          message: "ok",
          token: token,
          user: user
        });
      }
    });
  });
});




module.exports = router;
