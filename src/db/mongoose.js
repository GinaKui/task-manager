const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
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