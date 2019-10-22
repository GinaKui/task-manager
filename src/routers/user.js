const express = require('express');
const User = require('../models/user');

const router = new express.Router();

//Login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    res.send(user);
  } catch (err) {
    res.status(400).send();
  }
});

//create
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(401).send(err);
  }
});

//read
router.get('/users', async (req, res) => {
  try{
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//read
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//update
router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update) );
  if (!isValidOperation) {
    return res.status(400).send({ error: 'invalid user update' });
  }

  try {
    //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    const user = await User.findById(req.params.id);
    updates.forEach(update => user[update] = req.body[updates]);
    await user.save();  //use save() instead of findByIdAndUpdate(), to ensure the authentication middleware will be called

    if(!user) return res.status(404).send('User not found');
    res.send(user);
  } catch(err) {
    res.status(400).send('server error');;
  }
});

//Delete
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).send('User not found');
    res.send(user);
  } catch(err) {
    res.status(500).send('server error');;
  }
});

module.exports = router;