const express = require('express');
const multer = require('multer');

const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();



//create
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(401).send(err);
  }
});

//Login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send();
  }
});

//Logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token );
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

/**
 * Read, Private Route
 */
router.get('/users', auth, async (req, res) => {
  try{
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//update
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update) );
  if (!isValidOperation) {
    return res.status(400).send({ error: 'invalid user update' });
  }

  try {
    //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    updates.forEach(update => req.user[update] = req.body[updates]);
    await req.user.save();  //use save() instead of findByIdAndUpdate(), to ensure the authentication middleware will be called    
    res.send(req.user);
  } catch(err) {
    res.status(400).send('server error');;
  }
});

//Delete
router.delete('/users/me', auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if(!user) return res.status(404).send('User not found');
    await req.user.remove(); //mongoose method, remove()
    res.send(req.user);
  } catch(err) {
    res.status(500).send('server error');;
  }
});

const upload = multer({
  limits: {
    fileSize: 100000 //100kb
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
      return callback(new Error('Image need to be in .png, .jpg or .jpeg format'));
    }
    callback(undefined, true); //successfuly uploaded, send back success response to client
  }
});

//avatar upload route
router.post('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {
  req.user.avatar = req.file.buffer;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {  //this signature is needed to handle uncatched error
  res.status(400).send({ error: error.message });
});

//avater delete
router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

//serve the avatar
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar);
  } catch (err) {
    res.status(404).send();
  }
});

module.exports = router;