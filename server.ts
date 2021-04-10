require('dotenv').config();
import {apiRouter} from "./src/routes/apis";
import * as bodyParser from 'body-parser';
import {dashboardRouter} from "./src/routes/dashboard";

const Express = require('express');
const app = Express();

// shim();
app.use(bodyParser.json());
app.use('/api/v1', apiRouter);
app.use('/api/dashboard', dashboardRouter);

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

app.on('ready', function () {
    console.info("App is ready.");
    app.listen(port, function () {
        console.info("Started Jobs Server App on port: " + port);
        console.info("App Environment: " + env);
    });
});

app.emit('ready');

