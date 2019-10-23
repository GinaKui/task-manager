const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
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
});

module.exports = Task;