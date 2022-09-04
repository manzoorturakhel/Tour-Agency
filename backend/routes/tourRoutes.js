const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

//router.param('id', tourController.checkID);
// 61a333c25c7c887ed02223e9

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(authController.protect, tourController.createTour);

router
  .route("/top-5-tours")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.get("/get-monthly-report/:year", tourController.monthlyReport);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(authController.protect, tourController.updateTour)
  .delete(authController.protect, tourController.deleteTour);

module.exports = router;
