import express, { urlencoded } from "express";
import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import User from "../models/users.model.js";
import passport from "passport";
import userController from "../controllers/users.controllers.js"

const router = Router({ mergeParams: true });




router.route("/signup")
    .get( userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));


router.route("/login")
    .get(userController.renderLogInForm)
    .post(passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), userController.login);


//LogOut
router.get("/logout", userController.logout);

export default router;