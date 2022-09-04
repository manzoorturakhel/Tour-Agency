const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("../../models/tour");
const Review = require("../../models/review");

dotenv.config({
  path: "./config.env",
});
const DB =
  "mongodb+srv://manzoorturrakhel:Safiullah12@cluster0.0uvr1.mongodb.net/Natours?retryWrites=true&w=majority";
mongoose
  .connect(DB)
  .then(() => {
    //console.log(con.connections);
    console.log("db connection successful!");
  })
  .catch((err) => {
    console.log(err.message);
  });

dotenv.config({ path: "./config.env" });

const tourData = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const reviewsData = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));

//console.log(tourData);

const importTours = async () => {
  try {
    await Tour.create(tourData);
    console.log("data imported");
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

const deleteTours = async () => {
  try {
    await Tour.deleteMany();
    console.log("deleted!!!");
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

const importReviews = async () => {
  try {
    await Review.create(reviewsData);
    console.log("reviews importation completed");
  } catch (err) {
    console.log(err.message);
  }
};

if (process.argv[2] === "import") {
  console.log(process.arg[2], "inside import");
  importTours();
} else if (process.argv[2] === "delete") {
  deleteTours();
}
importTours();
// //deleteTours();
// importReviews();
console.log(process.argv);
