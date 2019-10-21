const express = require('express');

//database related
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
//register routers
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log(`express server starts on port: ${PORT}`);
});