import Listing from "../models/listings.model.js";
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';

// Helper function to get geocoding client with error handling
const getGeoCodingClient = () => {
    const token = process.env.MAP_TOKEN;
    if (!token) {
        console.error('MAP_TOKEN environment variable is missing');
        throw new Error('Mapbox access token is not configured');
    }
    return mbxGeocoding({ accessToken: token });
};

const index = async (req, res) => {
    try {
        const listings = await Listing.find({}).populate("owner", "username");
        res.render("./listings/index.ejs", { listings });
    } catch (error) {
        req.flash("error", "Unable to load listings");
        res.redirect("/");
    }
}

const renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

const createListing = async (req, res) => {
    try {
        // Create geocoding client inside the function
        const geoCodingClient = getGeoCodingClient();

        let response = await geoCodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

        const listingData = { ...req.body.listing };
        
        // Handle image upload
        if (req.file) {
            listingData.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        
        // Create new listing
        const newListing = new Listing(listingData);
        newListing.owner = req.user._id;
        newListing.geometry = response.body.features[0].geometry;
        
        await newListing.save();
        
        req.flash("success", "New Listing Added!");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        req.flash("error", "Failed to create listing. Please try again.");
        res.redirect("/listings/new");
    }
}

const renderEditForm = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing you requested doesn't exist");
            return res.redirect("/listings");
        }
        
        // Create optimized image URL for preview
        let originalUrl = listing.image?.url || '';
        if (originalUrl) {
            originalUrl = originalUrl.replace("/upload", "/upload/h_200,w_600");
        }
        
        res.render("./listings/edit.ejs", { listing, originalUrl });
    } catch (error) {
        console.error("Error rendering edit form:", error);
        req.flash("error", "Unable to load edit form");
        res.redirect("/listings");
    }
}

const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if listing exists
        const existingListing = await Listing.findById(id);
        if (!existingListing) {
            req.flash("error", "Listing you requested doesn't exist");
            return res.redirect("/listings");
        }
        
        // Prepare update data
        const updateData = {
            title: req.body.listing.title,
            description: req.body.listing.description,
            price: req.body.listing.price,
            location: req.body.listing.location,
            country: req.body.listing.country
        };
        
        // Handle location change - update geometry if location changed
        if (req.body.listing.location !== existingListing.location) {
            try {
                const geoCodingClient = getGeoCodingClient();
                let response = await geoCodingClient.forwardGeocode({
                    query: req.body.listing.location,
                    limit: 1,
                })
                .send();
                
                if (response.body.features && response.body.features.length > 0) {
                    updateData.geometry = response.body.features[0].geometry;
                }
            } catch (geoError) {
                console.error("Error geocoding new location:", geoError);
                // Continue with update even if geocoding fails
            }
        }
        
        // Handle image update logic
        if (req.file) {
            // New file uploaded - use the new file
            updateData.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        } else {
            // No new file uploaded - keep existing image
            if (existingListing.image && existingListing.image.url) {
                updateData.image = {
                    url: existingListing.image.url,
                    filename: existingListing.image.filename || ''
                };
            }
            // If there was no existing image and no new file, image will be undefined
        }
        
        // Update listing
        await Listing.findByIdAndUpdate(id, updateData, { 
            new: true, 
            runValidators: true 
        });
        
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        req.flash("error", "Failed to update listing. Please try again.");
        res.redirect(`/listings/${req.params.id}/edit`);
    }
}

const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested doesn't exist");
            return res.redirect("/listings");
        }
        
        await Listing.findByIdAndDelete(id);
        
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error deleting listing:", error);
        req.flash("error", "Failed to delete listing. Please try again.");
        res.redirect("/listings");
    }
}

const showListing = async (req, res) => {
    try {
        const { id } = req.params;
        
        const listing = await Listing.findById(id)
            .populate("owner", "username email")
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                    select: "username"
                },
                options: { sort: { createdAt: -1 } } // Sort reviews by newest first
            });
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        
        res.render("listings/show.ejs", { 
            listing,
            mapToken: process.env.MAP_TOKEN 
        });
    } catch (error) {
        console.error("Error showing listing:", error);
        req.flash("error", "Unable to load listing");
        res.redirect("/listings");
    }
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