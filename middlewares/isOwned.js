import Listing from "../models/listings.model.js";

const isOwned = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You don't have permission to perform this action");
            return res.redirect(`/listings/${id}`);
        }
        
        next();
    } catch (error) {
        req.flash("error", "Something went wrong");
        return res.redirect("/listings");
    }
};

export default isOwned;