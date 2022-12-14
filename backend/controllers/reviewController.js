const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user;

  if (!req.body.tour) req.body.tour = req.params.tourId;

  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});
// exports.gettingParams = (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   next();
// };
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
