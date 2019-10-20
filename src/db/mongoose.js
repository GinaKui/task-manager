const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1/27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
});

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if(value< 0) {
        throw new Error('age should be positive');
      } else if (value > 130) {
        throw new Error('beyond human lifespan');
      }
    }
  }
});

const me = new User({
  name: 'Gina Kui',
  age: 25
})

me.save().then( res => {
  console.log(res);
}).catch(err => {
  console.log('Error', err)
});

const Task = mongoose.model('Task', {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
});

const task = new Task({
  description: 'Learn the mongo library',
  completed: false
});

task.save().then(res => {
  console.log('Sucess', res);
}).catch(err => {
  console.log('Error', error)
})