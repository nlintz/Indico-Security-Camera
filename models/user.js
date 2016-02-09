var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    userSchema;

userSchema = new Schema({
  name: String,
  p_at_door: Number,
  createdAt: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('userSchema', userSchema);
