const express = require("express");
const { createAdmin, adminLogin } = require("../control/admin");
const myAdminRouter = express.Router();





myAdminRouter.post('/addAdmin', createAdmin);
myAdminRouter.post('/ownLogin', adminLogin);

module.exports = myAdminRouter;