const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

/**
 * Generates a PDF certificate for a student
 * 
 * @param {Object} data - The certificate data
 * @returns {Promise<Buffer>} - Resolves with the PDF file buffer
 */
const generateCertificate = async (data) => {
    try {
        const {
            name, certType, title, projectTitle,
            university, domain, startDate, endDate, gainedSkills, referenceNumber, companyName,
            staticPath // For QR code link
        } = data;

        console.log(`[DEBUG] generateCertificate received referenceNumber: ${referenceNumber}`);

        const logoPath = path.join(__dirname, "..", "public", "logo.png");

        // Create a document
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margins: { top: 40, bottom: 40, left: 40, right: 40 }
        });

        // Collect data into a buffer
        const buffers = [];
        const pdfPromise = new Promise((resolve, reject) => {
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
        });

        // Draw Certificate Outer and Inner Borders
        doc.rect(15, 15, doc.page.width - 30, doc.page.height - 30).lineWidth(4).stroke("#1e3a8a");
        doc.rect(22, 22, doc.page.width - 44, doc.page.height - 44).lineWidth(1).stroke("#1e3a8a");
        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(1).stroke("#e2e8f0");

        // Add Logo & Tagline
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, doc.page.width / 2 - 100, 50, { width: 40 });
        }
        doc.font("Helvetica").fontSize(12).fillColor("#475569").text("Your Vision, Our Code", doc.page.width / 2 - 50, 65, { align: "left" });

        doc.x = doc.page.margins.left;
        doc.moveDown(4);

        // Title
        const displayHeader = certType === "Internship" ? "CERTIFICATE OF INTERNSHIP" : "CERTIFICATE OF COMPLETION";
        doc.font("Helvetica-Bold").fontSize(35).fillColor("#1e40af").text(displayHeader, { align: "center" });
        doc.moveDown(1);

        doc.font("Helvetica").fontSize(14).fillColor("#475569").text(`This is to certify that`, { align: "center" });
        doc.moveDown(0.5);

        // Student Name
        doc.font("Helvetica-Bold").fontSize(40).fillColor("#1e40af").text(name, { align: "center" });

        // Line under name
        const nameY = doc.y + 5;
        doc.moveTo(doc.page.width / 2 - 200, nameY).lineTo(doc.page.width / 2 + 200, nameY).lineWidth(1).stroke("#1e40af");
        doc.y = nameY + 20;

        // Main Text Body
        doc.font("Helvetica").fontSize(14).fillColor("#334155");

        const fieldName = title || domain || 'Web Development';
        const sDate = startDate || '[ Date ]';
        const eDate = endDate || '[ Date ]';
        const cName = companyName || 'Namma Tech Solutions';
        const uniName = university || '[ University Name ]';
        const skills = gainedSkills || '[ Enter gained skills ]';

        let paragraph1 = "";
        let paragraph2 = "";

        if (certType === "Internship") {
            paragraph1 = `student of ${uniName}, has successfully completed a summer internship in the field of ${fieldName} from ${sDate} to ${eDate} under guidance of ${cName}.`;
            paragraph2 = `During the period of her/ his internship program with us, she/ he had been exposed to ${skills}.`;
        } else {
            paragraph1 = `student of ${uniName}, has successfully completed the project titled "${projectTitle || fieldName}" in the field of ${fieldName} from ${sDate} to ${eDate} under guidance of ${cName}.`;
            paragraph2 = `During this project completion, she/ he had demonstrated exceptional skills in ${skills}.`;
        }

        doc.text(paragraph1, 100, doc.y, { align: "center", width: doc.page.width - 200, lineGap: 5 });
        doc.moveDown(1);
        doc.text(paragraph2, 100, doc.y, { align: "center", width: doc.page.width - 200, lineGap: 5 });

        // Generate QR Code
        // Use the referenceNumber passed from the controller to ensure consistency with the database
        const refNum = referenceNumber || `REF-${Date.now()}`;
        let issueDate = new Date().toLocaleDateString();

        console.log(`[DEBUG] Final refNum used in PDF/QR: ${refNum}`);

        try {
            // QR code should point to the frontend verification page
            const qrUrl = `https://namma-tech-solutions-client.onrender.com/verify-certificate/${refNum}`;

            const qrOptions = {
                errorCorrectionLevel: 'H', // High error correction for URLs
                margin: 1,
                color: { dark: '#000000', light: '#ffffff' }
            };
            const qrDataUrl = await QRCode.toDataURL(qrUrl, qrOptions);
            const qrImageBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
            doc.image(qrImageBuffer, doc.page.width / 2 - 40, doc.page.height - 140, { width: 80 });
        } catch (qrErr) {
            console.error("QR Code generation failed", qrErr);
        }

        // Footer areas
        const footerY = doc.page.height - 100;

        // Bottom Left
        doc.font("Helvetica").fontSize(14).fillColor("#000000");
        doc.text("NAMMA TECH SOLUTIONS", 100, footerY, { align: "center", width: 200 });
        doc.moveTo(100, footerY + 20).lineTo(300, footerY + 20).lineWidth(1).stroke("#000");
        doc.font("Helvetica").fontSize(12).fillColor("#475569").text("Authorized organ", 100, footerY + 25, { align: "center", width: 200 });

        // Bottom Right
        doc.font("Helvetica").fontSize(14).fillColor("#000000");
        doc.text(refNum, doc.page.width - 300, footerY, { align: "center", width: 200 });
        doc.moveTo(doc.page.width - 300, footerY + 20).lineTo(doc.page.width - 100, footerY + 20).lineWidth(1).stroke("#000");
        doc.font("Helvetica").fontSize(12).fillColor("#475569").text(issueDate, doc.page.width - 300, footerY + 25, { align: "center", width: 200 });

        doc.end();
        return await pdfPromise;

    } catch (error) {
        console.error("Error in generateCertificate:", error);
        throw error;
    }
};

module.exports = { generateCertificate };
