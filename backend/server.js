// use process.env to access variables in .env in the root of backend directory.
require("dotenv").config();
const express = require("express");
const app = express();

// necessary middleware in order to receive requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routing configuration
const imageRouter = require('./routes/imageRoutes')
app.use('/api/image')

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server listening on port ${port}`))
