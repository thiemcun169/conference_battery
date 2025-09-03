# ICISE Conference Website

A full-featured conference website with admin panel for the "Bacterial Pathogens and Host Cell Interactions" conference at ICISE, Quy Nhon, Vietnam.

## Features

### Public Website
- 📄 **Multi-page Conference Website** - Home, Speakers, Program, Committee, Venue, Registration, Contact
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX** - Beautiful design with smooth animations and professional styling
- 📝 **Registration System** - Online registration with abstract submission capability
- 🎤 **Speaker Showcase** - Dynamic speaker profiles with photos and talk information
- 📅 **Program Display** - Conference schedule and session information
- 🌐 **Dynamic Content** - Content managed through admin panel

### Admin Dashboard
- 🔐 **Secure Authentication** - JWT-based login system
- 📊 **Dashboard Analytics** - Registration stats, speaker counts, and activity overview
- 📝 **Content Management** - Full CMS for website content (HTML, Markdown, JSON support)
- 👥 **Speaker Management** - Add, edit, and manage speaker profiles
- 📋 **Registration Management** - View and manage conference registrations
- 📁 **File Management** - Upload and manage images and documents
- 🎯 **Real-time Updates** - Changes reflect immediately on the public website

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Helmet** for security
- **Rate limiting** and **CORS** protection

### Frontend
- **Vanilla JavaScript** (ES6+)
- **Bootstrap 5** for responsive design
- **Font Awesome** for icons
- **Custom CSS** with modern design patterns

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   cd /home/pc/Documents/conference
   npm install
   ```

2. **Setup environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB** (if not running)
   ```bash
   mongod
   ```

4. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the website**
   - Main website: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

### Default Admin Credentials
- **Email**: admin@icisequynhon.com
- **Password**: admin123

⚠️ **Important**: Change the default admin password immediately in production!

## Configuration

### Environment Variables (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/icise_conference

# Server
PORT=3000
NODE_ENV=development

# JWT Security
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Admin Account
ADMIN_EMAIL=admin@icisequynhon.com
ADMIN_PASSWORD=admin123

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./public/uploads
```

## File Structure

```
conference/
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── README.md                 # This file
├── env.example               # Environment template
├── models/                   # Database models
│   ├── User.js              # Admin user model
│   ├── Content.js           # CMS content model
│   ├── Speaker.js           # Speaker model
│   └── Registration.js      # Registration model
├── routes/                   # API routes
│   ├── auth.js              # Authentication routes
│   ├── admin.js             # Admin panel routes
│   └── public.js            # Public API routes
├── middleware/               # Custom middleware
│   └── auth.js              # Authentication middleware
└── public/                   # Static files
    ├── index.html           # Main website
    ├── admin.html           # Admin dashboard
    ├── css/                 # Stylesheets
    │   ├── style.css        # Main website styles
    │   └── admin.css        # Admin dashboard styles
    ├── js/                  # JavaScript files
    │   ├── main.js          # Main website functionality
    │   └── admin.js         # Admin dashboard functionality
    ├── images/              # Website images
    └── uploads/             # User uploaded files
```

## Usage Guide

### Admin Dashboard

1. **Login** to the admin panel at `/admin`
2. **Dashboard** - View registration statistics and recent activity
3. **Content Management** - Add/edit website content
4. **Speaker Management** - Manage speaker profiles and talks
5. **Registration Management** - Review and approve registrations
6. **File Management** - Upload and organize media files

### Content Management
The CMS supports multiple content types:
- **HTML** - Rich formatted content
- **Markdown** - Simple markup for documentation
- **JSON** - Structured data for complex content
- **Text** - Plain text content

### Speaker Management
Add speakers with:
- Personal information (name, title, affiliation)
- Biography and contact details
- Talk information (title, abstract, type)
- Profile images and social links
- Keynote and publication status

### Registration System
Features include:
- Personal and professional information
- Registration type selection
- Dietary requirements
- Accommodation requests
- Abstract submission
- Automated email confirmation

## Customization

### Styling
- Edit `/public/css/style.css` for main website styling
- Edit `/public/css/admin.css` for admin dashboard styling
- Colors and fonts can be customized via CSS variables

### Content
- All website content is manageable through the admin panel
- Add custom pages by creating new content items
- Modify the navigation by editing the HTML templates

### Features
- Add new models in the `/models` directory
- Create new API endpoints in the `/routes` directory
- Extend functionality in the JavaScript files

## Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   # Set secure JWT secret
   # Configure production database
   # Set up email service (optional)
   ```

2. **Database Setup**
   - Use MongoDB Atlas or hosted MongoDB
   - Ensure proper indexing for performance
   - Set up automated backups

3. **Security Considerations**
   - Use HTTPS in production
   - Set strong JWT secrets
   - Configure proper CORS settings
   - Use environment-specific configurations
   - Regular security updates

4. **Server Deployment**
   - Use PM2 for process management
   - Set up reverse proxy (Nginx)
   - Configure SSL certificates
   - Set up monitoring and logging

### Docker Deployment (Optional)
```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## API Documentation

### Public Endpoints
- `GET /api/content` - Get published content
- `GET /api/speakers` - Get published speakers
- `POST /api/register` - Submit registration
- `GET /api/registration-status/:email` - Check registration status
- `GET /api/info` - Get conference information

### Admin Endpoints (Authentication Required)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET/POST/PUT/DELETE /api/admin/content` - Content management
- `GET/POST/PUT/DELETE /api/admin/speakers` - Speaker management
- `GET /api/admin/registrations` - Registration management
- `POST /api/admin/upload` - File upload
- `GET/DELETE /api/admin/files` - File management

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/change-password` - Change password

## Support

### Common Issues

1. **Database Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify database permissions

2. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Ensure allowed file types

3. **Authentication Problems**
   - Verify JWT secret configuration
   - Check token expiration settings
   - Ensure admin user exists

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### License
This project is licensed under the MIT License.

### Contact
For support or questions:
- Email: contact@icisequynhon.com
- Phone: +84 2563 646 609

---

**ICISE Conference Website** - Built with ❤️ for the scientific community


