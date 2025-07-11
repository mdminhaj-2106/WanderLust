import listingSchema from '../schema.js';
import myError from "../utils/myError.js";

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new myError(400, errMsg);
    } else {
        next();
    }
};

export default validateListing;