const catchAsync= require('../utils/catchAsync');
const AppErr= require('../utils/appErr');
const APIFeautures= require('../utils/apiFeatures');



exports.createOne= Model =>  catchAsync(async (req, res, next) => {
 
  const docs = await Model.create(req.body);

  return res.status(201).json({
    status: "success",
    data: {
      data: docs,
    },
  });
});

exports.updateOne= Model=>catchAsync(async (req, res, next) => {
    const { id } = req.params;
  
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppErr("id not found", 404));
  
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
)};



exports.deleteOne= Model=> catchAsync(async (req, res, next) => {
    const { id } = req.params;
  
    const doc = await Model.findByIdAndDelete(id, {
      new: true,
    });
    if (!doc) return next(new AppErr("id not found", 404));
  
    return res.status(204).json({
      status: "success",
      data: null,
    });
  });
  
exports.getOne=(Model,options)=>catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query= Model.findById(id);
    if(options) {
        query= query.populate(options);
    }
    const doc = await query;
    if (!doc) {
      return next(new AppErr("id not found", 404));
    } 
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

  exports.getAll=Model=>catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
 
    const api = new APIFeautures(Model.find(filter), req.query);
  
    api.filter();
    api.limitFields();
    api.sort();
    api.pagination();
  
    const docs = await api.query;
    
    return res.status(200).json({
      status: "success",
  
      results: docs.length,
      data: {
        data: docs,
      },
     
    });
  });