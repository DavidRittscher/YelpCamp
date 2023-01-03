const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const Campground = require('../models/campground')
const Review = require('../models/review');
const AppError = require('../utils/AppError');
const wrapAsync = require('../utils/wrapAsync');
const reviews = require('../controller/reviews')




// Review post
router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview))

// delete reviews campground
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.destroyReview))


module.exports = router