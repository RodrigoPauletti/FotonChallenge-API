const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const requireDir = require("require-dir");
const dotenv = require("dotenv");

// Starting app
const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

// Starting DB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

requireDir("./src/models");

// Routes
app.use("/api", require("./src/routes"));

app.listen(process.env.PORT || 3001);
