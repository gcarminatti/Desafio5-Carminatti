import { Router } from "express";
import User from "../models/users.js";
import bcrypt from "bcrypt";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/", (req, res) => {
  res.render("home", {
    user: req.session.user,
  });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/login", async (req, res) => {
  const { user, password } = req.body;

  try {
    const userFound = await User.findOne({ username: user });
    if (userFound) {
      const passwordMatch = await bcrypt.compare(password, userFound.password);

      if (passwordMatch) {
        req.session.user = userFound;
        res.json({ status: "success", message: "Inicio de sesión exitoso" });
      } else {
        res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      }
    } else {
      res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
  } catch (err) {
    console.error("Error al buscar el usuario en la base de datos:", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

export default router;
