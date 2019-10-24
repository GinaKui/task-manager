const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  description: {
    type: String,
    require: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'  //exactly the model name
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;