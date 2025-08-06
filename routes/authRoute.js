import express from "express";
import {
  forgotPasswordController,
  registerController,
} from "../controllers/authController.js";
import { loginController } from "../controllers/authController.js";
import { testController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMidddleware.js";
// router object
const router = express.Router();

// routing
// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || METHOD POST
router.post("/login", loginController);

//Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Test Route
router.get("/test", requireSignIn, isAdmin, testController);

// Protected Route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
export default router;
