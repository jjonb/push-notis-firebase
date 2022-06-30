const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect("mongodb://localhost/push-notis-firebase").then((_, err) => {
  if (err) throw new Error({ msg: err });
  console.log("Connected to MongoDB");
});

app.use("/notify", require("./routes/notification-routes"));

app.listen(PORT, () => console.log(`app listening on port: ${PORT}`));
