const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
//@desc Get All bootcamps
//@route Get /api/v1/ bootstrap
//@ccess public

exports.getBootCamps = asyncHandler(async (req, res, next) => {
  let query;

  //copy req query
  const reqQuery = { ...req.query };
  // Fields to Exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop from the remove fields
  removeFields.forEach(param => delete reqQuery[param]);

  //create query string
  let queryStr = JSON.stringify(req.query);

  //create operators($gt,$lt)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // Sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.select(sortBy);
  } else {
    query = query.sort('-CreatedAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;

  const limit = parseInt(req.query.limit, 10) || 100;
  const StartIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments;
  query = query.skip(StartIndex).limit(limit);
  // Execute query

  const bootcamps = await query;

  //Paginatioin
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (StartIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps
  });
});

//@desc Get single bootcamp
//@route Get /api/v1/ bootstrap/:id
//@access public

exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      err
      //new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc Create new bootcamp
//@route Post /api/v1/ bootstrap
//@access public

exports.CreateBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

//@desc Upadate bootcamp
//@route put /api/v1/ bootstrap/:id
//@access public

exports.UpdateBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc Delete bootcamp
//@route delete /api/v1/ bootstrap/:id
//@access publica
exports.DeleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  res.status(200).json({ success: true, data: {} });
});

//@desc Get Bootstamp Within the area
//@route delete /api/v1/ bootstrap/radius/:Zipcode/:distance
//@access publica
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  //get lat and log from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //calc radius of earth

  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
