import { reviewSchema } from '../schema.js';
import myError from "../utils/myError.js";

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new myError(400, errMsg);
    } else {
        next();
    }
};

export default validateReview;