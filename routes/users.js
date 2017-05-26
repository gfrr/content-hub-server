const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtOptions = require('../config/jwtOptions');
const User = require("../models/user");
const Content = require("../models/content");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("../config/passport.js");


router.get("/secret", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json({
    message: "Success! You can not see this without a token"
  });
});

router.post('/users/:id/save', passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    console.log("SAVE CONTENT CALLED");
    const newContent = Content(req.body);
    newContent.save((err, content) => {
      if (err) res.status(400).json({
        message: err
      });
      User.find({
        _id: req.params.id
      }, (err, users) => {
        if (err) res.status(400).json({
          message: err
        });
        users[0].favorites.push(newContent._id);
        users[0].save();
        console.log(users[0]);
        res.status(200).json({
          message: typeof(users[0].favorites[0])
        });
      });
    });

  });


/* DELETE a USER. */
router.delete('/users/:id',
  passport.authenticate('jwt', {
    session: false
  }), (req, res) => {

    console.log("DELETE CALLED ");
    User.findOneAndRemove({
      '_id': req.params.id
    }, (err) => {
      if (err) res.status(400).json({
        message: 'Not found'
      });
      res.status(200).json({
        message: 'ELIMINATED'
      });
    });
  });


module.exports = router;
