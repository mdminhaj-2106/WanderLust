import express, { urlencoded } from "express";
import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import User from "../models/users.model.js";
import passport from "passport";
import userController from "../controllers/users.controllers.js"

const router = Router({ mergeParams: true });

//SignUp, GET
router.get("/signup", userController.renderSignUpForm);

//SignUp, POST
router.post("/signup", wrapAsync(userController.signUp));

//LogIn, GET
router.get("/login", userController.renderLogInForm);

//Login POST
router.post("/login", passport.authenticate('local', { 
    failureRedirect: '/login', 
    failureFlash: true 
}), userController.login);

//LogOut
router.get("/logout", userController.logout);

export default router;