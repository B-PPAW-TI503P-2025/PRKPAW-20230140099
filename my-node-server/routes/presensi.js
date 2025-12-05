const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/permissionMiddleware');
const { validateUpdatePresensi, validateCreatePresensi } = require('../validators/presensiValidator');

router.use(authenticateToken);
router.post('/check-in', [authenticateToken, presensiController.upload.single('image')], presensiController.CheckIn);
router.post("/check-out", presensiController.CheckOut);
router.put("/:id", validateUpdatePresensi, presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);

module.exports = router;
