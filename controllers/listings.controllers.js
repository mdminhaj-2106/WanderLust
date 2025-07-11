import Listing from "../models/listings.model.js";

const index = async (req, res) => {
    const listings = await Listing.find({});
    res.render("./listings/index.ejs", { listings });
}

const renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

const createListing = async (req, res) => {
    if (!req.body.listing.image || !req.body.listing.image.url) {
        delete req.body.listing.image;
    }
    const item = new Listing(req.body.listing);
    item.owner = req.user._id;
    await item.save();
    req.flash("success", "New Listing Added!");
    res.redirect("/listings");
}


const renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
}

const updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist");
        return res.redirect("/listings");
    }
    
    await Listing.findByIdAndUpdate(id, {
        title: req.body.listing.title,
        description: req.body.listing.description,
        image: { url: req.body.listing.image.url },
        price: req.body.listing.price,
        location: req.body.listing.location,
        country: req.body.listing.country
    });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

const deleteListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist");
        return res.redirect("/listings");
    }
    
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}


const showListing = async (req, res) => {
    let { id } = req.params;
    
    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author",
                select: "username" 
            }
        });
    
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    
    res.render("listings/show.ejs", { listing });
}

export default {
    index,
    renderNewForm,
    renderEditForm,
    createListing,
    updateListing,
    deleteListing,
    showListing
}