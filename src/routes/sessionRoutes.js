import { Router } from "express";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    res.send({ status: "success", message: "User Register" });
  }
);

router.get("/failregister", async (req, res) => {
  res.send({ error: "failed" });
});
export default router;
