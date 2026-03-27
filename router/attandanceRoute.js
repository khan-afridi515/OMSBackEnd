const express = require('express');
const userRouter = express.Router();
const { markattandance, userAttandance, allUserAttandance } = require("../control/attandance");
const { authorization } = require('../auth');




userRouter.post('/markAttandacne', authorization, markattandance);
// for user
userRouter.get('/userAttandance', authorization, userAttandance);
// for admin
userRouter.get('/alluserAttandance', authorization, allUserAttandance);

module.exports = userRouter;

