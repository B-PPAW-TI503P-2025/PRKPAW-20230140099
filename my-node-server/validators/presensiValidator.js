const { body, validationResult } = require("express-validator");

// Validator untuk endpoint PUT /api/presensi/:id
exports.validateUpdatePresensi = [
  // Validasi waktuCheckIn
  body("checkIn")
    .optional() // Opsional, tidak wajib diisi
    .notEmpty()
    .withMessage("checkIn tidak boleh kosong jika disertakan")
    .isISO8601()
    .withMessage("checkIn harus berformat tanggal yang valid (ISO 8601)")
    .toDate(), // Convert string ke Date object

  // Validasi waktuCheckOut
  body("checkOut")
    .optional() // Opsional, tidak wajib diisi
    .notEmpty()
    .withMessage("checkOut tidak boleh kosong jika disertakan")
    .isISO8601()
    .withMessage("checkOut harus berformat tanggal yang valid (ISO 8601)")
    .toDate() // Convert string ke Date object
    .custom((value, { req }) => {
      // Custom validation: checkOut harus setelah checkIn
      if (req.body.checkIn && value) {
        const checkIn = new Date(req.body.checkIn);
        const checkOut = new Date(value);
        
        if (checkOut <= checkIn) {
          throw new Error("checkOut harus setelah checkIn");
        }
      }
      return true;
    }),

  // Middleware untuk handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }
    
    next();
  }
];

// Validator untuk endpoint POST (create presensi) - BONUS
/*exports.validateCreatePresensi = [
  body("nama")
    .notEmpty()
    .withMessage("Nama wajib diisi")
    .isString()
    .withMessage("Nama harus berupa text")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Nama harus antara 3-100 karakter"),

  body("userId")
    .notEmpty()
    .withMessage("userId wajib diisi")
    .isInt()
    .withMessage("userId harus berupa angka"),

  body("checkIn")
    .notEmpty()
    .withMessage("checkIn wajib diisi")
    .isISO8601()
    .withMessage("checkIn harus berformat tanggal yang valid")
    .toDate(),

  body("checkOut")
    .optional()
    .isISO8601()
    .withMessage("checkOut harus berformat tanggal yang valid")
    .toDate()
    .custom((value, { req }) => {
      // Validasi checkOut harus setelah checkIn (jika ada)
      if (value && req.body.checkIn) {
        const checkIn = new Date(req.body.checkIn);
        const checkOut = new Date(value);
        
        if (checkOut <= checkIn) {
          throw new Error("checkOut harus setelah checkIn");
        }
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }
    
    next();
  }
];*/