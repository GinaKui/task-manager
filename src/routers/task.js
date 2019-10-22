const express = require('express');
const Task = require('../models/task');

const router = new express.Router();
/**
 * task route
 */
//Create
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  
  try {
    await task.save();
    res.status(201).send(task); 
  } catch (err) {
    res.status(400).send(err);
  }
});

//Read
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch(err) { 
    res.status(500).send('server error');
  }
});

//Read
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).send('Task not found');
    res.send(task);
  } catch(err) {
    res.status(500).send('server error');
  }
});

//Update
router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update) );
  if (!isValidOperation) {
    return res.status(400).send({ error: 'invalid task update' });
  }

  try {
    //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    const task = await Task.findById(req.params.id);
    updates.forEach( update => task[updates] = req.body[updates] );
    await task.save();
    
    if(!task) return res.status(404).send("Task doesn't exist");
    res.send(task);
  } catch(err) {
    res.status(400).send(err);;
  }
});

//Delete
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if(!task) return res.status(404).send('Task not found');
    res.send(task);
  } catch(err) {
    res.status(500).send('server error');;
  }
});

module.exports = router;