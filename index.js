const express = require('express');
const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 10, // limit each IP to 10 requests per windowMs
    message : "Too many request, Please try again later"
});

const app = express();
app.use(limiter);
require('./routes/carRoutes')(app)

const PORT = process.env.PORT || 5000;
app.listen(PORT);