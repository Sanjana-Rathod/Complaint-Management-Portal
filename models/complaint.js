const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  username: String,
  complaint: String,
  PostedOn: {
    type: Date,
    default: Date.now,
  },
  category: String,
});

module.exports = complaintSchema;
