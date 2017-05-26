const express           = require('express');
const router            = express.Router();
const jwt               = require('jsonwebtoken');
const jwtOptions        = require('../config/jwtOptions');
const User              = require("../models/user");
const Content           = require("../models/content");
const bcrypt            = require("bcrypt");
const bcryptSalt        = 10;
const passport          = require("../config/passport.js");


router.get("/secret", passport.authenticate('jwt', { session: false }), (req, res)=>{
  res.json({message: "Success! You can not see this without a token"});
});

router.post('/users/:id/save', passport.authenticate('jwt', { session: false }),
  (req, res)=>{
  console.log("SAVE CONTENT CALLED");
  console.log(req.params.id);
  console.log(req.body);
  const newContent = Content(req.body);
  console.log(newContent);
  newContent.save((err, content)=>{
    if(err) res.status(400).json({message: err});
    else console.log("new item saved");
  });
  
  // console.log(req.params.id);
  // console.log(req.body);
  /*
  newUser.save((err, user) => {
    if (err) res.status(400).json({ message: err });
     else {
      const payload = {id: user._id, user: user.username};
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.status(200).json({message: "ok", token: token, user: user});
    }
  });
  */
  res.status(200).json("ayy");
});

/* DELETE a USER. */
router.delete('/users/:id',
  passport.authenticate('jwt', { session: false }), (req, res)=>{

  console.log("DELETE CALLED ");
  User.findOneAndRemove({'_id' : req.params.id}, (err)=>{
      if(err) res.status(400).json({message: 'Not found'});
      res.status(200).json({message: 'ELIMINATED'});
      });
});





// const contentSchema = new Schema({
//   source: {
//     type: String,
//     enum: ["YOUTUBE", "TWITTER", "TUMBLR", "REDDIT"],
//     default: "YOUTUBE"
//   },
//   data: {
//     type: Object,
//     default: {}
//   },
//   timestamps: {
//     createdAt: "created_at",
//     updatedAt: "updated_at"
//   }
// });








module.exports = router;
