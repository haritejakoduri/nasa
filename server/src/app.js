const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const api = require("./routes/api");

const app = express();
app.use(cors({ options: { origin: "http://localhost:3000" } }));
app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/v1", api);
app.get("/secret", (req, res) => {
  return res.send("Your personal secret value is 42!");
});
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
