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

//Get /tasks?completed=true
//Get /tasks?limit=10&skip=0
//Get /tasks?sortBy=createdAt_asc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};
  //req.query.completed is a string or undefined
  if (req.query.completed) {
    match.completed = req.query.completed === 'true'? true : false;
  }

  if(req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    //const tasks = await Task.find({ owner: req.user._id });
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();
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