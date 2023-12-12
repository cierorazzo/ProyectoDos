const express = require("express");
const dbCon = require("./config/dbCon");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const authRouter = require("./routes/authRoute");
const bodyParser = require("body-parser");
const { notFound } = require("./middlewares/ERRORhANDLER.JS");
const { errorHandler } = require("./middlewares/ERRORhANDLER.JS");

dbCon();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", authRouter);

app.use(notFound);
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor andando en el puerto ${PORT}`);
});
