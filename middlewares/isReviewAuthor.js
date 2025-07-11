import Review from "../models/reviews.model.js";

const isReviewAuthor = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);
        
        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect("/listings");
        }
        
        if (!review.author.equals(req.user._id)) {
            req.flash("error", "You don't have permission to delete this review");
            return res.redirect(`/listings/${req.params.id}`);
        }
        
        next();
    } catch (error) {
        req.flash("error", "Something went wrong");
        return res.redirect("/listings");
    }
};

export default isReviewAuthor;