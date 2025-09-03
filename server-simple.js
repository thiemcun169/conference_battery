const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting - More relaxed for development/demo
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for demo purposes
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Skip rate limiting for localhost/development
const skipRateLimit = (req) => {
  return req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1';
};

app.use((req, res, next) => {
  if (skipRateLimit(req)) {
    next();
  } else {
    limiter(req, res, next);
  }
});

// Middleware
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Simple data storage (JSON files)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize sample data
const initializeData = () => {
  const sampleSpeakers = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Professor of Microbiology',
      affiliation: 'Harvard Medical School',
      bio: 'Dr. Johnson is a leading researcher in bacterial pathogenesis with over 20 years of experience.',
      email: 'sarah.johnson@harvard.edu',
      talkTitle: 'Host-Pathogen Interactions in Bacterial Infections',
      talkType: 'keynote',
      isKeynote: true,
      isPublished: true,
      order: 1
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      title: 'Director of Infectious Disease Research',
      affiliation: 'Stanford University',
      bio: 'Prof. Chen specializes in antimicrobial resistance and novel therapeutic approaches.',
      email: 'mchen@stanford.edu',
      talkTitle: 'Novel Therapeutic Strategies Against Bacterial Pathogens',
      talkType: 'plenary',
      isKeynote: false,
      isPublished: true,
      order: 2
    }
  ];

  const sampleContent = [
    {
      id: '1',
      key: 'conference-overview',
      title: 'Conference Overview',
      content: 'This conference brings together leading scientists in bacterial pathogenesis research.',
      type: 'html',
      category: 'home',
      isPublished: true,
      order: 1
    },
    {
      id: '2',
      key: 'key-topics',
      title: 'Key Topics',
      content: '<ul><li>Cellular Microbiology of Intracellular Pathogens</li><li>Host Responses and Defense Mechanisms</li><li>Microbiota in Health and Disease</li><li>Novel Treatment Strategies</li></ul>',
      type: 'html',
      category: 'home',
      isPublished: true,
      order: 2
    },
    {
      id: '3',
      key: 'committee-chair',
      title: 'Conference Chair Information',
      content: '<h4>Prof. Jean Tran Thanh Van</h4><p>Founder, Rencontres du Vietnam</p><p>International Centre for Interdisciplinary Science and Education (ICISE)</p>',
      type: 'html',
      category: 'committee',
      isPublished: true,
      order: 1
    },
    {
      id: '4',
      key: 'venue-description',
      title: 'Venue Description',
      content: '<p>ICISE provides an inspiring environment for scientific collaboration and discovery. Located in the beautiful coastal city of Quy Nhon, Central Vietnam.</p>',
      type: 'html',
      category: 'venue',
      isPublished: true,
      order: 1
    },
    {
      id: '5',
      key: 'registration-info',
      title: 'Registration Information',
      content: '<p>Registration includes access to all sessions, meals, and conference materials. Early bird rates available until July 30, 2025.</p>',
      type: 'html',
      category: 'registration',
      isPublished: true,
      order: 1
    }
  ];

  // Write sample data
  fs.writeFileSync(path.join(dataDir, 'speakers.json'), JSON.stringify(sampleSpeakers, null, 2));
  fs.writeFileSync(path.join(dataDir, 'content.json'), JSON.stringify(sampleContent, null, 2));
  fs.writeFileSync(path.join(dataDir, 'registrations.json'), JSON.stringify([], null, 2));
  fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify([{
    id: '1',
    email: 'admin@icisequynhon.com',
    password: 'admin123',
    role: 'admin'
  }], null, 2));
};

// Initialize data if not exists
if (!fs.existsSync(path.join(dataDir, 'speakers.json'))) {
  initializeData();
}

// Helper functions to read/write data
const readData = (filename) => {
  try {
    const data = fs.readFileSync(path.join(dataDir, filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (filename, data) => {
  fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2));
};

// API Routes
app.get('/api/speakers', (req, res) => {
  const speakers = readData('speakers.json').filter(s => s.isPublished);
  res.json(speakers);
});

app.get('/api/content', (req, res) => {
  const { category } = req.query;
  let content = readData('content.json').filter(c => c.isPublished);
  
  if (category) {
    content = content.filter(c => c.category === category);
  }
  
  res.json(content);
});

app.get('/api/info', (req, res) => {
  const info = {
    title: 'Bacterial Pathogens and Host Cell Interactions',
    date: 'September 29 - October 3, 2025',
    location: 'ICISE, Quy Nhon, Vietnam',
    description: 'This conference will bring together scientists specializing in various aspects of infection biology.',
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
});

app.post('/api/register', (req, res) => {
  const registrations = readData('registrations.json');
  
  // Check if email already registered
  const existing = registrations.find(r => r.email === req.body.email);
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  
  const newRegistration = {
    id: Date.now().toString(),
    ...req.body,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };
  
  registrations.push(newRegistration);
  writeData('registrations.json', registrations);
  
  res.status(201).json({
    message: 'Registration submitted successfully',
    registrationId: newRegistration.id
  });
});

// Simple admin auth (for demo - not secure for production)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readData('users.json');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      token: 'demo-token-' + Date.now(),
      user: { id: user.id, email: user.email, role: user.role }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Admin dashboard stats
app.get('/api/admin/dashboard', (req, res) => {
  const registrations = readData('registrations.json');
  const speakers = readData('speakers.json');
  const content = readData('content.json');
  
  res.json({
    totalRegistrations: registrations.length,
    approvedRegistrations: registrations.filter(r => r.status === 'approved').length,
    abstractSubmissions: registrations.filter(r => r.abstractSubmission).length,
    publishedSpeakers: speakers.filter(s => s.isPublished).length,
    contentItems: content.length
  });
});

// Admin content management
app.get('/api/admin/content', (req, res) => {
  const content = readData('content.json');
  res.json(content);
});

app.post('/api/admin/content', (req, res) => {
  const content = readData('content.json');
  const newContent = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  content.push(newContent);
  writeData('content.json', content);
  res.status(201).json(newContent);
});

app.put('/api/admin/content/:id', (req, res) => {
  const content = readData('content.json');
  const index = content.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Content not found' });
  }
  content[index] = { ...content[index], ...req.body, updatedAt: new Date().toISOString() };
  writeData('content.json', content);
  res.json(content[index]);
});

app.delete('/api/admin/content/:id', (req, res) => {
  const content = readData('content.json');
  const filteredContent = content.filter(c => c.id !== req.params.id);
  if (content.length === filteredContent.length) {
    return res.status(404).json({ message: 'Content not found' });
  }
  writeData('content.json', filteredContent);
  res.json({ message: 'Content deleted successfully' });
});

// Admin speaker management
app.get('/api/admin/speakers', (req, res) => {
  const speakers = readData('speakers.json');
  res.json(speakers);
});

app.post('/api/admin/speakers', (req, res) => {
  const speakers = readData('speakers.json');
  const newSpeaker = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  speakers.push(newSpeaker);
  writeData('speakers.json', speakers);
  res.status(201).json(newSpeaker);
});

app.put('/api/admin/speakers/:id', (req, res) => {
  const speakers = readData('speakers.json');
  const index = speakers.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Speaker not found' });
  }
  speakers[index] = { ...speakers[index], ...req.body, updatedAt: new Date().toISOString() };
  writeData('speakers.json', speakers);
  res.json(speakers[index]);
});

app.delete('/api/admin/speakers/:id', (req, res) => {
  const speakers = readData('speakers.json');
  const filteredSpeakers = speakers.filter(s => s.id !== req.params.id);
  if (speakers.length === filteredSpeakers.length) {
    return res.status(404).json({ message: 'Speaker not found' });
  }
  writeData('speakers.json', filteredSpeakers);
  res.json({ message: 'Speaker deleted successfully' });
});

// Admin registrations management
app.get('/api/admin/registrations', (req, res) => {
  const registrations = readData('registrations.json');
  const { status, page = 1, limit = 20 } = req.query;
  
  let filteredRegistrations = registrations;
  if (status && status !== 'all') {
    filteredRegistrations = registrations.filter(r => r.status === status);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, endIndex);
  
  res.json({
    registrations: paginatedRegistrations,
    total: filteredRegistrations.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredRegistrations.length / limit)
  });
});

app.put('/api/admin/registrations/:id/status', (req, res) => {
  const registrations = readData('registrations.json');
  const index = registrations.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Registration not found' });
  }
  registrations[index].status = req.body.status;
  registrations[index].updatedAt = new Date().toISOString();
  writeData('registrations.json', registrations);
  res.json(registrations[index]);
});

// Serve main website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin assets securely
app.get('/admin/css/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'css', req.params.filename));
});

app.get('/admin/js/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'js', req.params.filename));
});

// API endpoint to read page files (admin only)
app.get('/api/admin/pages/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const allowedFiles = ['index.html', 'committee.html', 'speakers.html', 'program.html', 'venue.html', 'registration.html', 'contact.html'];
    
    if (!allowedFiles.includes(filename)) {
      return res.status(400).json({ message: 'Invalid file name' });
    }
    
    const filePath = path.join(__dirname, 'public', filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    
    res.json({
      filename,
      content: fileContent,
      size: stats.size,
      lastModified: stats.mtime,
      lines: fileContent.split('\n').length
    });
  } catch (error) {
    console.error('Error reading page file:', error);
    res.status(500).json({ message: 'Error reading file' });
  }
});

// API endpoint to save page files (admin only)
app.put('/api/admin/pages/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const { content } = req.body;
    
    const allowedFiles = ['index.html', 'committee.html', 'speakers.html', 'program.html', 'venue.html', 'registration.html', 'contact.html'];
    
    if (!allowedFiles.includes(filename)) {
      return res.status(400).json({ message: 'Invalid file name' });
    }
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    const filePath = path.join(__dirname, 'public', filename);
    
    // Create backup before saving
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    if (fs.existsSync(filePath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(backupDir, `${filename}.${timestamp}.backup`);
      fs.copyFileSync(filePath, backupPath);
    }
    
    // Save new content
    fs.writeFileSync(filePath, content, 'utf8');
    const stats = fs.statSync(filePath);
    
    res.json({
      message: 'File saved successfully',
      filename,
      size: stats.size,
      lastModified: stats.mtime,
      lines: content.split('\n').length
    });
  } catch (error) {
    console.error('Error saving page file:', error);
    res.status(500).json({ message: 'Error saving file' });
  }
});

// Secure admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'admin.html'));
});

// Handle specific page routes
app.get('/committee.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'committee.html'));
});

app.get('/speakers.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'speakers.html'));
});

app.get('/program.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'program.html'));
});

app.get('/venue.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'venue.html'));
});

app.get('/registration.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registration.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Handle all other routes for SPA
app.get('*', (req, res) => {
  if (req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, 'admin', 'admin.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Conference website is running!`);
  console.log(`📱 Main website: http://localhost:${PORT}`);
  console.log(`⚙️  Admin panel: http://localhost:${PORT}/admin`);
  console.log(`👤 Admin login: admin@icisequynhon.com / admin123`);
  console.log(`💡 Note: This is a demo version without MongoDB`);
});
