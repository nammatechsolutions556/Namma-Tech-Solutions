const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./config/db.js');

const { createAdminTable } = require('./models/Admin.js');
const { createClientUsersTable } = require('./models/ClientUsers.js');
const { createProjectsTable } = require('./models/Project.js');
const { createRequestsTable } = require('./models/ProjectRequest.js');
const { createInternshipApplicationsTable } = require('./models/InternshipApplication.js');
const { createInternshipsTable } = require('./models/Internship.js');
const { createCertificatesTable } = require('./models/Certificate.js');
const { createContactMessagesTable } = require('./models/ContactMessage.js');
const { createPortfolioProjectsTable } = require('./models/PortfolioProject.js');

const authRoutes = require('./routes/authRoutes.js');
const projectRoutes = require('./routes/projectRoutes.js');
const requestRoutes = require('./routes/requestRoutes.js');
const applicationRoutes = require('./routes/applicationRoutes.js');
const internshipRoutes = require('./routes/internshipRoutes.js');
const certificateRoutes = require('./routes/certificateRoutes.js');
const contactRoutes = require('./routes/contactRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const portfolioRoutes = require('./routes/portfolioRoutes.js');

// Middlewares
const path = require('path');
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

pool.connect(async (err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  release();
  console.log('Connected to the database');

  // Initialize Database Tables
  await createAdminTable();
  await createClientUsersTable();
  await createProjectsTable();
  await createRequestsTable();
  await createInternshipApplicationsTable();
  await createInternshipsTable();
  await createCertificatesTable();
  await createContactMessagesTable();
  await createPortfolioProjectsTable();
});

const PORT = process.env.PORT || 5000;

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
