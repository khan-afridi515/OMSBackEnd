const express = require('express');
const app = express();
const connectDB = require('./db');
const routes = require('./router/route');
const cors = require('cors');
const userRouter = require('./router/attandanceRoute');
const myEventRouter = require('./router/eventRouter');
const myAdminRouter = require('./router/adminRouter');
const leaveRoutes = require('./router/leaveRouter');





app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api/v0/users',routes);
app.use('/api/v1/attandance', userRouter);
app.use('/api/v2/eventRoute', myEventRouter);
app.use('/api/v3/adminroute', myAdminRouter);
app.use('/api/v4/leaveRoute', leaveRoutes);



app.listen(3002,()=>{
    connectDB();
    console.log('successful http://localhost:3002/api/v0/users/postUser')
})



