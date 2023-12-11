const express = require("express");
const dbCon = require("./config/dbCon");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;

dbCon();
app.use("/", (req, res) => {
  res.send("HOLIS DESDE ACUÁS");
});
app.listen(PORT, () => {
  console.log(`Servidor andando en el puerto ${PORT}`);
});

