const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();
/**
 * task route
 */
//Create
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  
  try {
    await task.save();
    res.status(201).send(task); 
  } catch (err) {
    res.status(400).send(err);
  }
});

//Read
router.get('/tasks', auth, async (req, res) => {
  try {
    //const tasks = await Task.find({ owner: req.user._id });
    await req.user.populate('tasks').execPopulate();
    res.send(req.user.tasks);
  } catch (err) { 
    res.status(500).send('server error');
  }
});

//Read
router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if(!task) return res.status(404).send('Task not found');
    res.send(task);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//Update
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update) );
  if (!isValidOperation) {
    return res.status(400).send({ error: 'invalid task update' });
  }

  try {
    //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if(!task) return res.status(404).send("Task doesn't exist");
    updates.forEach( update => task[updates] = req.body[updates] );
    await task.save();
    res.send(task);
  } catch (err) {
    res.status(400).send(err);;
  }
});

//Delete
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if(!task) return res.status(404).send('Task not found');
    res.send(task);
  } catch (err) {
    res.status(500).send('server error');;
  }
});

module.exports = router;