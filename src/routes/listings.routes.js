import express, { urlencoded } from "express";
import { Router } from "express";
import Listing from "../models/listings.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import validateListing from '../middlewares/validateListing.js';
import isLoggedIn from "../middlewares/isLoggedIn.js";
import isOwned from "../middlewares/isOwned.js";
import listingController from "../controllers/listings.controllers.js"
import listingSchema from "../schema.js";

const router = Router({ mergeParams: true });

//index route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwned, wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id", isLoggedIn, isOwned, validateListing, wrapAsync(listingController.updateListing));

//destroy route
router.delete("/:id", isLoggedIn, isOwned, wrapAsync(listingController.deleteListing));

//show route
router.get("/:id", wrapAsync(listingController.showListing));

export default router;