import Joi from "joi";

// Listing validation schema
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow("", null)
        }).optional(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required()
});

// Review validation schema
const reviewSchema = Joi.object({
    review: Joi.object({
        comments: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});

export default listingSchema;
export { reviewSchema };