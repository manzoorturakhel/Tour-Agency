const Tour = require("../models/tour");
const APIFeautures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppErr = require("../utils/appErr");

// exports.checkID = (req, res, next, val) => {
//   // console.log(`Tour id is: ${val}`);

//   if (params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  console.log("inside middleware!!");
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // console.log(req.requestTime);
  //console.log(req.query);
  // try {
  //filtering

  //  const queryObj={...req.query};

  //  const exculdeQuery=['limit','page','fields','sort'];

  //  // if queryObj includes the excludedquery then we delete them for queryObj

  //  exculdeQuery.forEach(el=> delete queryObj[el]);

  // // console.log(queryObj);
  //  //advanced Filtering for gte,gt,lte,lt
  //  let advancedFilter= JSON.stringify(queryObj);
  //  // replacing the gte and other with $gte and others to match the query
  //  advancedFilter= advancedFilter.replace(/\b(gte|gt|lte|lt)\b/g,match=> `$${match}`);
  // // console.log(advancedFilter);

  //  // Tour.find({difficulty:'easy',duration:{$gte:5}})

  // let query=  Tour.find(JSON.parse(advancedFilter));

  // sorting
  // sort(price ratingsAverage) but in query we do put comma because we cant put space in query so therefore we should replace , with space
  // if(req.query.sort){
  //   // this is ascending order inorder to sort it in descending order we should put - infront of it.
  //   const sortBy= req.query.sort.split(',').join(' ');
  //   //console.log("sort is included")
  //   query= query.sort(sortBy);
  // }else{
  //   // if there is no sort query we will sort it based on createdData(newest one)
  //   query=query.sort('-createdAt');
  // }

  // limiting fields

  // if(req.query.fields){
  //   const fields= req.query.fields.split(',').join(' ');
  //   query=query.select(fields);
  // }else{
  //   query= query.select('-__v'); // adding - will exclude the field.
  // }

  // adding pagination
  // const page=req.query.page*1 || 1;
  // const limit= req.query.limit*1 || 3;
  // const skip= (page-1) * limit;

  // const totalDocs= await Tour.find(queryObj).countDocuments();
  // if(skip>=totalDocs) throw new Error('page not found!!');

  // //console.log(typeof +page,typeof +limit,typeof skip,skip,page)

  //   query=query.skip(skip).limit(limit);

  // const totalDocs= await query.countDocuments();

  // if(skip>=totalDocs) throw new Error('page not found')

  // console.log("My query:",query);
  const api = new APIFeautures(Tour.find(), req.query);
  //console.log('api Query:',api.query)
  api.filter();
  api.limitFields();
  api.sort();
  api.pagination();

  const allTours = await api.query;
  //console.log(allTours);
  return res.status(200).json({
    status: "success",

    results: allTours.length,
    data: {
      tours: allTours,
    },
    //   });
    // } catch (err) {
    //   return res.status(404).json({
    //     status: 'fail',
    //     message: err.message,
    //   });
    // }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //console.log(req.params);
  const { id } = req.params;
  //console.log(id);

  //   const tour = tours.find((el) => el.id === id);
  

  const tour = await Tour.findById(id).populate({
    path: "reviews",
  });
  
  //console.log("yyyy:", tour);
  if (!tour) {
    //console.log("no tour!!!");
    return next(new AppErr("id not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // console.log(req.body);

  // const newId = tours[tours.length - 1].id + 1; // eslint-disable-next-line node/no-unsupported-features/es-syntax
  //   const newTour = { id: newId, ...req.body };

  //   tours.push(newTour);

  //   fs.writeFile(
  //     `${__dirname}/dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours),
  //     (err) => {
  //       console.log(err);

  // we can also create new tours such as this

  /*
         const newTour= new Tour({
             name:"something",
             price:0.0,
             rating:4.9
         })

         newTour.save().then(doc=>{
             return res.status(201).json({
                 status:'success',
                 data:{
                     data:doc
                 }
             })
         }).catch(err=>{
              return res.status(404).json({
      status: 'fail',
      message: err.message,
    
         })

      */
  const newTour = await Tour.create(req.body);

  return res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log("ID:", id);

  const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log("req body:", req.body);
  if (!updatedTour) return next(new AppErr("id not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      tour: updatedTour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  const tour = await Tour.findByIdAndDelete(id, {
    new: true,
  });
  console.log(tour);
  if (!tour) return next(new AppErr("id not found", 404));

  return res.status(204).json({
    status: "success",
    tour: null,
  });
});
exports.monthlyReport = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  //console.log("year:",year)

  const tourDetails = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: "$startDates",
        },
        numOfTours: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $sort: { numOfTours: -1 },
    },
  ]);
  return res.status(201).json({
    status: "success",
    results: tourDetails.length,
    tour: tourDetails,
  });
});
