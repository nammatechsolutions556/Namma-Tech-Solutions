const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../public/uploads");
try {
    if (!fs.existsSync(uploadDir)) {
        console.log(`[DEBUG] Creating upload directory: ${uploadDir}`);
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (err) {
    console.error(`[ERROR] Failed to create upload directory: ${err.message}`);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [DEBUG] Multer: Writing file to disk: ${file.originalname}`);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        console.log(`[DEBUG] Multer saving file as: ${uniqueName}`);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images, videos, and documents (resumes)
    const allowedMimeTypes = [
        "image/",
        "video/",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const isAllowed = allowedMimeTypes.some(type => file.mimetype.startsWith(type));

    if (isAllowed) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only images, videos, and documents (PDF, DOC, DOCX) are allowed."), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit to accommodate videos
    }
});

module.exports = upload;
