const express = require('express');
const routes = express.Router();
const upload = require('../multer');
const { createClient, userLogin } = require('../control/controller');


routes.post('/postUser', upload.single("img"), createClient);
routes.post('/loginUser', userLogin);



module.exports = routes;

