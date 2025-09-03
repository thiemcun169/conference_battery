const express = require('express');
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const Speaker = require('../models/Speaker');
const Registration = require('../models/Registration');

const router = express.Router();

// Get public content
router.get('/content', async (req, res) => {
  try {
    const { category, key } = req.query;
    const filter = { isPublished: true };
    
    if (category) filter.category = category;
    if (key) filter.key = key;

    const content = await Content.find(filter).sort({ order: 1 });
    res.json(content);
  } catch (error) {
    console.error('Get public content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single content item by key
router.get('/content/:key', async (req, res) => {
  try {
    const content = await Content.findOne({ key: req.params.key, isPublished: true });
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Get content by key error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get published speakers
router.get('/speakers', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isPublished: true };
    
    if (type) filter.talkType = type;

    const speakers = await Speaker.find(filter).sort({ order: 1, name: 1 });
    res.json(speakers);
  } catch (error) {
    console.error('Get public speakers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get keynote speakers
router.get('/speakers/keynotes', async (req, res) => {
  try {
    const speakers = await Speaker.find({ 
      isPublished: true, 
      isKeynote: true 
    }).sort({ order: 1, name: 1 });
    
    res.json(speakers);
  } catch (error) {
    console.error('Get keynote speakers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit registration
router.post('/register', [
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('affiliation').trim().isLength({ min: 1 }).withMessage('Affiliation is required'),
  body('country').trim().isLength({ min: 1 }).withMessage('Country is required'),
  body('registrationType').isIn(['regular', 'student', 'postdoc', 'faculty', 'industry']).withMessage('Invalid registration type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if email already registered
    const existingRegistration = await Registration.findOne({ email: req.body.email });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const registration = new Registration(req.body);
    await registration.save();

    res.status(201).json({
      message: 'Registration submitted successfully',
      registrationId: registration._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Check registration status
router.get('/registration-status/:email', async (req, res) => {
  try {
    const registration = await Registration.findOne({ 
      email: req.params.email.toLowerCase() 
    }).select('status submittedAt');
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    res.json({
      status: registration.status,
      submittedAt: registration.submittedAt
    });
  } catch (error) {
    console.error('Check registration status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conference info (for meta data, etc.)
router.get('/info', async (req, res) => {
  try {
    const info = {
      title: 'Bacterial Pathogens and Host Cell Interactions',
      date: 'September 29 - October 3, 2025',
      location: 'ICISE, Quy Nhon, Vietnam',
      description: 'This conference will bring together scientists specializing in various aspects of infection biology to explore the fundamental mechanisms of host-microbe interactions.',
      keyTopics: [
        'Cellular Microbiology of Intracellular Pathogens',
        'Host Responses and Intracellular Defense Mechanisms',
        'Microbiota in Health and Disease',
        'Bacterial Pathogenesis & Novel Treatment Strategies'
      ],
      importantDates: {
        registrationOpen: '2025-05-05',
        earlyBirdDeadline: '2025-07-30',
        conferenceStart: '2025-09-29',
        conferenceEnd: '2025-10-03'
      },
      contact: {
        phone: '+84 2563 646 609',
        email: 'contact@icisequynhon.com',
        address: '07 Science Avenue, Quy Nhon Nam, Gia Lai province, Vietnam'
      }
    };
    
    res.json(info);
  } catch (error) {
    console.error('Get conference info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


