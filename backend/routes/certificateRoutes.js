const express = require("express");
const { getCertificates, getClientCertificates, createCertificate, deleteCertificate, sendCertificate, updateCertificate } = require("../controllers/certificateController");
const { protectAdmin, protectClient } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected admin routes to view, create, update, delete, and send certificates
router.get("/", protectAdmin, getCertificates);
router.post("/", protectAdmin, createCertificate);
router.put("/:id", protectAdmin, updateCertificate);
router.post("/:id/send", protectAdmin, sendCertificate);
router.delete("/:id", protectAdmin, deleteCertificate);

// Protected client route to view their own certificates (Token issues currently bypassable by direct email query)
router.get("/client", getClientCertificates);

module.exports = router;
