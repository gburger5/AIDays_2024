// use process.env to access variables in .env in the root of backend directory.
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

// db connection
mongoose.connect("mongodb://localhost/hackathon");

// necessary middleware in order to receive requests
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routing configuration
const imageRouter = require("./routes/imageRoutes");
app.use("/api", imageRouter);

// errorhandler needs to be at the end of all routing
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server listening on port ${port}`));
