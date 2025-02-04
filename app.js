const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const statusCode = require("./utils/error");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.use("/", mainRouter);

app.use((req, res) => {
  res
    .status(statusCode.DocumentNotFoundError.code)
    .send({ message: statusCode.DocumentNotFoundError.message });
});

app.listen(PORT, () => {
  console.log(`Server is running  on port ${PORT}`);
});
