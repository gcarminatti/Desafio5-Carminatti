import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import userRouter from "./routes/userRoutes.js";
import sessionsRouter from "./routes/sessionRoutes.js";
import process from "process";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const app = express();
const port = 8080;

const uri = process.env.VITE_DB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(uri, options)
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    store: new MongoStore({
      mongoUrl: process.env.VITE_DB_URI,
      ttl: 3600,
    }),
    secret: "Termolar1234!",
    resave: false,
    saveUninitialized: false,
  })
);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", userRouter);
app.use("/api/sessions", sessionsRouter);

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
