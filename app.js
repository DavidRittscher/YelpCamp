if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


// console.log(process.env.NODE_ENV.CLOUDINARY_SECRET)
const express = require('express');
const session = require('express-session');


const path = require('path');

const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize')
// const helmet = require('helmet')


const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');







// const { join } = require('path');
// const campground = require('./models/campground');
// const dbUrl = process.env.DB_URL

mongoose.set('strictQuery', false);

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch(error => {
        console.log('Oh no an Error NO MONGO');
        console.log(error);
    })

const db = mongoose.connection

const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

// app.use(helmet());


// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.tiles.mapbox.com",
//     "https://api.mapbox.com",
//     "https://kit.fontawesome.com",
//     "https://cdnjs.cloudflare.com",
//     "https://cdn.jsdelivr.net",
//    " https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css"
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com",
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.mapbox.com",
//     "https://api.tiles.mapbox.com",
//     "https://fonts.googleapis.com",
//     "https://use.fontawesome.com",
//     "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
//     "https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com",
//     "https://*.tiles.mapbox.com",
//     "https://events.mapbox.com",
//     "https://api.mapbox.com",
//     "https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css",
//     "http://localhost:3000/javascripts/clusterMap.js",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],

//             childSrc: ["blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/diasx2emf/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com",
//                 "https://api.mapbox.com",
//                 "https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css"
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//             upgradeInsecureRequests:[],
//         },
//     })
// );

app.use(mongoSanitize())
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';


const MongoStore = require('connect-mongo');

const store =  MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // mili min hour day and days
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// use this before using passport.session
app.use(session(sessionConfig))
// 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// routes for campground and reviews and users
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


// home
app.get('/', (req, res) => {
    res.render('home')
})

// All Error
app.all('*', (req, res, next) => {
    next(new AppError('Page Not Found', 404))
})
// Error Message NExt
app.use((err, req, res, next) => {
    const { status = 500, } = err;
    if (!err.message) err.message = "Oh No! Something went wrong!"
    res.status(status).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})