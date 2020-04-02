const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');
const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pleas enter the name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Pleas enter the Desc'],
    trim: true,
    maxlength: [500, 'Name can not be more than 50 characters']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please enter valid url'
    ]
  },
  phone: {
    type: String,
    maxlength: [500, 'Phone number cannot be greater then 20 characters']
  },
  Email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter valid email address.'
    ]
  },
  address: {
    type: String,
    required: [true, 'Add an address']
  },
  location: {
    //geo json
    type: {
      type: String,
      enum: ['point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedaddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },

  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be atleast 1'],
    max: [10, 'Rating must be maximum 10']
  },
  averageCost: Number,
  Photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobassistance: {
    type: Boolean,
    default: false
  },
  jobguarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  cfreatedAt: {
    type: Date,
    default: Date.now
  }
});

//create bootcamp slug from the name
BootcampSchema.pre('save', function() {
  //console.log('slugyfy ran', this.name);
  this.slug = slugify(this.name, { lower: true });
  next;
});

//create bootcamp geocoder
BootcampSchema.pre('save', async function(next) {
  //console.log('slugyfy ran', this.name);
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedaddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    Zip: loc[0].zipcode,
    country: loc[0].countryCode
  };
  //Do not save address
  this.address = undefined;
  next;
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
