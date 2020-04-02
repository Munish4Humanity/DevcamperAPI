const express = require('express');

const {
  getBootCamps,
  getBootCamp,
  CreateBootCamp,
  UpdateBootCamp,
  DeleteBootCamp,
  getBootcampsInRadius
} = require('../controllers/bootcamps');

const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router
  .route('/')
  .get(getBootCamps)
  .post(CreateBootCamp);

router
  .route('/:id')
  .get(getBootCamp)
  .put(UpdateBootCamp)
  .delete(DeleteBootCamp);
module.exports = router;
