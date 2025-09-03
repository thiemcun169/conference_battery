const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  affiliation: {
    type: String,
    required: [true, 'Affiliation is required'],
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  registrationType: {
    type: String,
    enum: ['regular', 'student', 'postdoc', 'faculty', 'industry'],
    required: true,
    default: 'regular'
  },
  dietary: {
    type: String,
    enum: ['none', 'vegetarian', 'vegan', 'halal', 'kosher', 'other'],
    default: 'none'
  },
  dietaryOther: {
    type: String,
    trim: true
  },
  accommodation: {
    type: Boolean,
    default: false
  },
  abstractSubmission: {
    type: Boolean,
    default: false
  },
  abstractTitle: {
    type: String,
    trim: true
  },
  abstractContent: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'refunded'],
    default: 'pending'
  },
  registrationFee: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', registrationSchema);


