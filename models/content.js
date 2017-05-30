const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const contentSchema = new Schema({
  source: {
    type: String,
    enum: ["YOUTUBE", "TWITTER", "TUMBLR", "REDDIT"],
    default: "YOUTUBE"
  },
  searchTag: String,
  data: {
    type: Object,
    default: {}
  }},
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }


});

const Content = mongoose.model("Content", contentSchema);
module.exports = Content;
