const express = require("express");
const router = express.Router({ mergeParams: true });

const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

router.get(
  "/",
  authController.protect,

  reviewController.getAllReviews
);
router.post(
  "/",
  authController.protect,
  authController.restrictTo("user"),
  reviewController.createReview
);

module.exports = router;
