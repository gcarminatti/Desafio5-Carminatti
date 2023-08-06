import { Router } from "express";
import User from "../models/users.js";
import Product from "../models/products.js";
import jwt from "jsonwebtoken";

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

router.get("/products", async (req, res) => {
  try {
    // Obtener todos los productos de la base de datos
    const products = await Product.find({}).lean();

    // Renderiza la vista "products.handlebars" y pasa los productos como datos

    res.render("products", { products });
  } catch (err) {
    console.error("Error al obtener los productos:", err);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // El usuario se ha autenticado con éxito, ahora verifica su rol
    if (user.role === "admin") {
      // Si el usuario tiene role "admin", muestra la vista adminView
      return res.render("adminView", { email: user.email });
    } else {
      // Si es un usuario con role "user" , redirige a /products
      return res.redirect("/products");
    }
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// register endpoint
router.post("/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // Crea una nueva instancia de usuario y recolecta los datos
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
        role: request.body.role,
      });

      // Guarda el usuario
      user
        .save()
        // Retorno en caso de que el usuario sea creado exitosamente
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // Catch en casa de error al crear el usuario
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // Catch en caso de problemas con la password
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

export default router;
