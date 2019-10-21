const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
});



// const me = new User({
//   name: 'Gina Kui',
//   age: 25,
//   email: 'developerkui@outlook.com',
//   password: 'password'
// });

// me.save().then( res => {
//   console.log(res);
// }).catch(err => {
//   console.log('Error', err)
// });



// const task = new Task({
//   description: 'Learn the mongo library',
//   completed: false
// });

// task.save().then(res => {
//   console.log('Sucess', res);
// }).catch(err => {
//   console.log('Error', error)
// })