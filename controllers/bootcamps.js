const Bootcamp = require('../models/Bootcamp');
//@desc Get All bootcamps
//@route Get /api/v1/ bootstrap
//@ccess public

exports.getBootCamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, data: bootcamps });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

//@desc Get single bootcamp
//@route Get /api/v1/ bootstrap/:id
//@access public

exports.getBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

//@desc Create new bootcamp
//@route Post /api/v1/ bootstrap
//@access public

exports.CreateBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

//@desc Upadate bootcamp
//@route put /api/v1/ bootstrap/:id
//@access public

exports.UpdateBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `update bootcamp ${req.params.id}` });
};

//@desc Delete bootcamp
//@route delete /api/v1/ bootstrap/:id
//@access public
exports.DeleteBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
