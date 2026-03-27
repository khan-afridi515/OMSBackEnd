const express = require('express');
const leaveRoutes = express.Router();
const {applyLeave, approveLeave, getAllLeaves, getAllUsersleaves} = require('../control/leave');
const { authorization } = require('../auth');




leaveRoutes.post('/leave', authorization, applyLeave);

leaveRoutes.get('/wholeleaves', authorization, getAllLeaves);

leaveRoutes.get('/allusersleaves', authorization, getAllUsersleaves);

leaveRoutes.post('/approvedLeave/:leaveId', authorization, approveLeave);


module.exports = leaveRoutes;

