import express, { urlencoded } from "express";
import { Router } from "express";
import Listing from "../models/listings.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import validateListing from '../middlewares/validateListing.js';
import isLoggedIn from "../middlewares/isLoggedIn.js";
import isOwned from "../middlewares/isOwned.js";
import listingController from "../controllers/listings.controllers.js";
import listingSchema from "../schema.js";
import multer from 'multer';


import { storage } from "../cloudConfig.js";

const upload = multer({ storage: storage }); 
const router = Router({ mergeParams: true });

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingController.createListing));

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .put(isLoggedIn, isOwned, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwned, wrapAsync(listingController.deleteListing))
    .get(wrapAsync(listingController.showListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwned, wrapAsync(listingController.renderEditForm));

export default router;