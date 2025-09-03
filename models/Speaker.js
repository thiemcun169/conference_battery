const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  affiliation: {
    type: String,
    trim: true
  },
  bio: {
    type: String
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  website: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  socialLinks: {
    twitter: String,
    linkedin: String,
    researchgate: String,
    orcid: String
  },
  talkTitle: {
    type: String,
    trim: true
  },
  talkAbstract: {
    type: String
  },
  talkType: {
    type: String,
    enum: ['keynote', 'plenary', 'invited', 'contributed'],
    default: 'contributed'
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  isKeynote: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Speaker', speakerSchema);


