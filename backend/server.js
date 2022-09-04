const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({
  path: "./config.env",
});
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    //console.log(con.connections);
    //console.log('db connection successful!');
  })
  .catch(() => {
    // console.log(err.message);
  });

dotenv.config({ path: "./config.env" });
// const newTour = new Tour({
//   name: 'Nuristan',
//   price: 50,
// });
// newTour.save().then((doc) => {
//   console.log(doc);
// });

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  // console.log(`App running on port ${port}...`);
});
