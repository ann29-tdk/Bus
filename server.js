const express = require('express');
const app = express();
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const port = process.env.PORT || 5000;

app.use(express.json());
const usersRoute = require('./routes/usersRoute');
const busesRoute = require('./routes/busesRoute');
const bookingsRoute = require('./routes/bookingsRoute');

app.use('/api/users', usersRoute);
app.use('/api/buses', busesRoute);
app.use('/api/bookings', bookingsRoute);

const path = require("path");

//Serving the frontend

app.use(express.static(path.join(__dirname, './client/build')));

app.get("*", function(_, res){
    res.sendFile(
        path.join(__dirname, './client/build/index.html'),
        function(err){
            res.status(500).send(err);
        }
    );
});


app.listen(port, () => console.log(`Listening on port ${port}`));

