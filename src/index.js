import express, { urlencoded } from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import ejsMate from "ejs-mate";
import methodOverride from 'method-override';
import listingRouter from "./routes/listings.routes.js";
import reviewRouter from "./routes/reviews.routes.js";
import userRouter from "./routes/users.routes.js"
import myError from "./utils/myError.js";
import session from "express-session";
import flash from 'connect-flash';
import User from "./models/users.model.js";
import passport from "passport";
import localStrategy from "passport-local";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let port = 8080;
const app = express();

const sessionOptions = {
    secret: "mySecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // stores user-info in session
passport.deserializeUser(User.deserializeUser()); // deletes user-info from session

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then((result) => {
        console.log("Connection Established Successfully !!!");
    })
    .catch((err) => {
        console.log(err);
    });

// Root route - redirect to listings
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// User routes (signup, login, logout)
app.use("/", userRouter);

// Listings routes
app.use("/listings", listingRouter);

// Review routes
app.use("/listings/:id/reviews", reviewRouter);

// 404 handler for unmatched routes
app.use((req, res, next) => {
    next(new myError(404, "Page not found!"));
});

// Custom error handler
app.use((err, req, res, next) => {
    let { status = 500, message = "Some random err" } = err;
    console.log("Error caught:", err);
    res.status(status).render("error.ejs", { message });
});

// Setup server
app.listen(port, () => {
    console.log(`Server is listening via port ${port}`);
});