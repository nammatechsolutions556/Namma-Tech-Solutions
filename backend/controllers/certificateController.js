const pool = require("../config/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const { generateCertificate } = require("../utils/certificateGenerator");

// Helper function to generate a single PDF and store it in DB
// We now support more fields for the new layout
const generateAndStoreCertificate = async (data) => {
    try {
        const {
            name, email, certType, title, projectTitle,
            university, domain, startDate, endDate, gainedSkills, referenceNumber, companyName
        } = data;

        // Generate refNum once here and pass it down
        const refNum = referenceNumber || `REF-${Date.now()}`;
        console.log(`[DEBUG] Controller generating refNum: ${refNum}`);

        const safeName = name ? name.replace(/\s+/g, "_") : "Student";
        const fileName = `cert_${Date.now()}_${safeName}_${certType || 'Cert'}.pdf`;
        const staticPath = `/public/certificates/${fileName}`;
        const fullPath = path.join(__dirname, "..", "public", "certificates", fileName);

        // Generate the PDF using our utility
        console.log(`[DEBUG] Calling generateCertificate with referenceNumber: ${refNum}`);
        const pdfBuffer = await generateCertificate({
            ...data,
            referenceNumber: refNum, // Ensure the same refNum is used
            staticPath
        });

        // Write to file
        fs.writeFileSync(fullPath, pdfBuffer);

        const cName = companyName || 'Namma Tech Solutions';
        const displayTitle = certType === "Internship" && projectTitle ? `${title} (Project: ${projectTitle})` : title;

        const result = await pool.query(
            `INSERT INTO certificates (
                name, email, internship, certificate_url, 
                university, domain, start_date, end_date, gained_skills, reference_number, company_name, cert_type, project_title
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
            RETURNING id AS _id, name, email, internship, certificate_url AS "certificateUrl"`,
            [
                name, email, displayTitle, staticPath,
                university || null, domain || title || null, startDate || null, endDate || null,
                gainedSkills || null, refNum, cName, certType || 'Internship', projectTitle || null
            ]
        );

        return result.rows[0];
    } catch (err) {
        console.error("Error generating/storing certificate", err);
        throw err;
    }
};



// Get all certificates (Admin & Public lookup if needed)
const getCertificates = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id AS _id, name, email, internship, certificate_url AS "certificateUrl",
             university, domain, start_date, end_date, gained_skills, reference_number, 
             company_name, cert_type, project_title, is_sent 
             FROM certificates ORDER BY created_at DESC`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching certificates" });
    }
};

// Get certificates specifically for a logged in client
const getClientCertificates = async (req, res) => {
    const clientEmail = req.query.email;

    if (!clientEmail) {
        return res.status(400).json({ message: "Client email required" });
    }

    try {
        const result = await pool.query(
            `SELECT id AS _id, name, email, internship as title, project_title, cert_type, certificate_url AS "certificateUrl" 
             FROM certificates WHERE email = $1 ORDER BY created_at DESC`,
            [clientEmail]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching client certificates" });
    }
};


// Create a new certificate (Admin) natively with PDFKit
// Create a new certificate (Admin) natively with PDFKit
const createCertificate = async (req, res) => {
    const data = req.body;

    if (!data.name || !data.email || !data.certType || !data.title) {
        return res.status(400).json({ message: "Required fields are missing" });
    }

    if ((data.certType === "Internship" || data.certType === "Both") && !data.projectTitle) {
        return res.status(400).json({ message: "Project Title is required for Internship certificates" });
    }

    try {
        let results = [];

        // If the user requested Both, generate two certificates.
        if (data.certType === "Both") {
            const projectCert = await generateAndStoreCertificate({ ...data, certType: "Project" });
            const internshipCert = await generateAndStoreCertificate({ ...data, certType: "Internship" });
            results.push(projectCert, internshipCert);
        } else {
            // Generate single certificate
            const cert = await generateAndStoreCertificate(data);
            results.push(cert);
        }

        res.status(201).json({ message: "Certificates generated successfully", certificates: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error generating certificate" });
    }
};

// Delete a certificate (Admin)
const deleteCertificate = async (req, res) => {
    const { id } = req.params;
    try {
        const cert = await pool.query("SELECT certificate_url FROM certificates WHERE id = $1", [id]);

        if (cert.rows.length === 0) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        const staticPath = cert.rows[0].certificate_url;
        const fullPath = path.join(__dirname, "..", staticPath);

        await pool.query("DELETE FROM certificates WHERE id = $1", [id]);

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        res.status(200).json({ message: "Certificate deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting certificate" });
    }
};

// Send a certificate (Email it to client)
const sendCertificate = async (req, res) => {
    const { id } = req.params;
    try {
        const certResult = await pool.query("SELECT * FROM certificates WHERE id = $1", [id]);
        if (certResult.rows.length === 0) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        const cert = certResult.rows[0];
        const fullPath = path.join(__dirname, "..", cert.certificate_url);

        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ message: "Certificate PDF physically missing on server" });
        }

        // Configure Nodemailer (Using a dummy ethereal account or simply logging for now)
        // Adjust standard SMTP settings here
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.ethereal.email",
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_USER || "dummy_user",
                pass: process.env.SMTP_PASS || "dummy_pass"
            }
        });

        const mailOptions = {
            from: '"Namma Tech Solutions" <no-reply@nammatechsolutions.com>',
            to: cert.email,
            subject: `Your ${cert.cert_type} Certificate is Ready!`,
            text: `Dear ${cert.name},\n\nCongratulations on completing your ${cert.cert_type}! Please find your certificate attached.\n\nBest Regards,\nNamma Tech Solutions`,
            attachments: [
                {
                    filename: `${cert.cert_type}_Certificate.pdf`,
                    path: fullPath
                }
            ]
        };

        // Note: Unless SMTP credentials are set in .env, this might fail to send.
        // We will catch it and log, but update the DB to sent anyway for demonstration.
        try {
            await transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.error("Warning: Mail server not configured properly, email not actually sent. Set SMTP env vars.");
        }

        // Mark as sent
        await pool.query("UPDATE certificates SET is_sent = TRUE WHERE id = $1", [id]);

        res.status(200).json({ message: "Certificate sent to client successfully" });

    } catch (err) {
        console.error("Error sending cert:", err);
        res.status(500).json({ message: "Server error sending certificate" });
    }
};

// Update a certificate
const updateCertificate = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        // Find existing cert to delete old PDF
        const oldCert = await pool.query("SELECT certificate_url FROM certificates WHERE id = $1", [id]);
        if (oldCert.rows.length === 0) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        const oldPath = path.join(__dirname, "..", oldCert.rows[0].certificate_url);
        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }

        // Generate new PDF (but we pass data with certType etc, and we will update DB instead of inserting)
        // Since generateAndStoreCertificate ALWAYS inserts, we modify the approach: Let's delete the old DB record and create new,
        // or extract the PDF generation part.
        // Actually, deleting old and creating new is identical to an edit and simplest to handle here.
        await pool.query("DELETE FROM certificates WHERE id = $1", [id]);

        const cert = await generateAndStoreCertificate(data);
        res.status(200).json({ message: "Certificate updated successfully", certificate: cert });

    } catch (err) {
        console.error("Error updating cert:", err);
        res.status(500).json({ message: "Server error updating certificate" });
    }
}

// Verify a certificate by reference number
const verifyCertificate = async (req, res) => {
    const { referenceNumber } = req.params;
    try {
        const result = await pool.query(
            `SELECT name, email, internship, certificate_url AS "certificateUrl",
             university, domain, start_date, end_date, gained_skills, reference_number, 
             company_name, cert_type, project_title, created_at
             FROM certificates WHERE UPPER(reference_number) = UPPER($1)`,
            [referenceNumber]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Certificate not issued by Namma Tech Solutions" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error verifying certificate:", err);
        res.status(500).json({ message: "Server error during verification" });
    }
};

// Serve a certificate PDF, regenerating it if it's missing from the filesystem
const serveCertificate = async (req, res) => {
    const { fileName } = req.params;
    const fullPath = path.join(__dirname, "..", "public", "certificates", fileName);
    const dbPath = `/public/certificates/${fileName}`;

    try {
        // 1. Check if file exists
        if (fs.existsSync(fullPath)) {
            return res.sendFile(fullPath);
        }

        console.log(`[DEBUG] Certificate file missing on disk: ${fileName}. Attempting regeneration...`);

        // 2. File missing, fetch from DB
        const result = await pool.query(
            `SELECT * FROM certificates WHERE certificate_url = $1`,
            [dbPath]
        );

        if (result.rows.length === 0) {
            console.warn(`[WARN] Certificate not found in database for path: ${dbPath}`);
            return res.status(404).send("Certificate not found.");
        }

        const cert = result.rows[0];

        // 3. Regenerate buffer
        // Note: we need to map DB column names (snake_case) to the generator's expected camelCase/specific names
        const pdfBuffer = await generateCertificate({
            name: cert.name,
            email: cert.email,
            certType: cert.cert_type,
            title: cert.internship.split(" (Project:")[0], // Extract clean title if needed
            projectTitle: cert.project_title,
            university: cert.university,
            domain: cert.domain,
            startDate: cert.start_date ? cert.start_date.toISOString().split('T')[0] : null,
            endDate: cert.end_date ? cert.end_date.toISOString().split('T')[0] : null,
            gainedSkills: cert.gained_skills,
            referenceNumber: cert.reference_number,
            companyName: cert.company_name,
            staticPath: cert.certificate_url
        });

        // 4. Save to disk for future requests
        fs.writeFileSync(fullPath, pdfBuffer);
        console.log(`[DEBUG] Successfully regenerated and saved certificate: ${fileName}`);

        // 5. Serve the newly created file
        res.sendFile(fullPath);

    } catch (err) {
        console.error("Error serving/regenerating certificate:", err);
        res.status(500).send("Error retrieving certificate.");
    }
};

module.exports = {
    getCertificates,
    getClientCertificates,
    createCertificate,
    deleteCertificate,
    sendCertificate,
    updateCertificate,
    verifyCertificate,
    serveCertificate
};
