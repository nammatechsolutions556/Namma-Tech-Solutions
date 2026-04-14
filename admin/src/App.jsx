import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminLayout from './Layouts/AdminLayout';
import Login from './Pages/Login/Login';
import ManageProjects from './Pages/ManageProjects/ManageProjects';
import ManageInternships from './Pages/ManageInternships/ManageInternships';
import ManageRequests from './Pages/ManageRequests/ManageRequests';
import ManageApplications from './Pages/ManageApplications/ManageApplications';
import ManageCertificates from './Pages/ManageCertificates/ManageCertificates';
import Dashboard from './Pages/Dashboard/Dashboard';
import ClientEnquiries from './Pages/ClientEnquiries/ClientEnquiries';
import ManagePortfolio from './Pages/ManagePortfolio/ManagePortfolio';
import './App.css';


const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Layout Routes via AdminLayout */}
            <Route path="/*" element={<AdminLayout />}>
              {/* Index maps to /dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="internships" element={<ManageInternships />} />
              <Route path="requests" element={<ManageRequests />} />
              <Route path="applications" element={<ManageApplications />} />
              <Route path="certificates" element={<ManageCertificates />} />
              <Route path="enquiries" element={<ClientEnquiries />} />
              <Route path="portfolio" element={<ManagePortfolio />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
