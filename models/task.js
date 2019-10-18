const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const collectionName = "my-tasks";

const taskSchema = new Schema({
  task: { type: String },
});

module.exports = mongoose.model('Task', taskSchema, collectionName);