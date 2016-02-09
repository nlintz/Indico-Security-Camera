var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    lastUpdateSchema;

lastUpdateSchema = new Schema({
  updatedAt: {type: Date, default: Date.now()},
  createdAt: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('LastUpdate', lastUpdateSchema);
