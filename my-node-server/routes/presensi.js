const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
const { validateUpdatePresensi, validateCreatePresensi } = require('../validators/presensiValidator');

router.use(addUserData);
router.post("/check-in", presensiController.CheckIn);
router.post("/check-out", presensiController.CheckOut);
router.put("/:id", validateUpdatePresensi, presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);
module.exports = router;
