import User from "../models/users.model.js";


const renderSignUpForm = (req, res) => {
    res.render("./users/signup.ejs");
}

const signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            username: username,
            email: email
        });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        
        // Automatically log in the user after successful registration
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

const renderLogInForm = (req, res) => {
    res.render("./users/login.ejs");
}

const login = (req, res) => {
    req.flash("success", "Welcome Back to WanderLust!");
    res.redirect("/listings");
}

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged You Out");
        res.redirect("/listings");
    });
}

export default {
    renderSignUpForm,
    renderLogInForm,
    signUp,
    login,
    logout
}