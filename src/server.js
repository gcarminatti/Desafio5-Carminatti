import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/userRoutes.js";
import sessionsRouter from "./routes/sessionRoutes.js";

const app = express();
const port = 8080;

const uri =
  "mongodb+srv://gcarminatti:xKWO60ZiUXwGFumw@ecommercecoder.tbzf3xq.mongodb.net/ecommerce_login";
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
      mongoUrl:
        "mongodb+srv://gcarminatti:xKWO60ZiUXwGFumw@ecommercecoder.tbzf3xq.mongodb.net/ecommerce_login",
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

app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
