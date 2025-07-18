import express, { urlencoded } from "express";
import { Router } from "express";
import Listing from "../models/listings.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import validateReview from '../middlewares/validateReview.js';
import Review from "../models/reviews.model.js"; 
import isReviewAuthor from "../middlewares/isReviewAuthor.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import reviewController from "../controllers/reviews.controllers.js"

const router = Router({mergeParams: true});

//Reviews
//create review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//destroy review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

export default router;