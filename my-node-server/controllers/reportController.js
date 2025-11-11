const presensiRecords = require("../data/presensiData");
const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    let options = { where: {} };

    // Filter berdasarkan nama
    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    // Filter berdasarkan rentang tanggal
    // Menggunakan kolom checkIn untuk filter tanggal
    if (tanggalMulai && tanggalSelesai) {
      // Membuat object Date untuk tanggal mulai dan selesai
      const startDate = new Date(tanggalMulai);
      const endDate = new Date(tanggalSelesai);
      
      // Set waktu untuk endDate ke akhir hari (23:59:59)
      endDate.setHours(23, 59, 59, 999);

      options.where.checkIn = {
        [Op.between]: [startDate, endDate],
      };
    } else if (tanggalMulai) {
      // Jika hanya tanggalMulai yang diberikan
      const startDate = new Date(tanggalMulai);
      options.where.checkIn = {
        [Op.gte]: startDate,
      };
    } else if (tanggalSelesai) {
      // Jika hanya tanggalSelesai yang diberikan
      const endDate = new Date(tanggalSelesai);
      endDate.setHours(23, 59, 59, 999);
      options.where.checkIn = {
        [Op.lte]: endDate,
      };
    }

    // Menambahkan ordering berdasarkan checkIn (terbaru ke terlama)
    options.order = [["checkIn", "DESC"]];

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      filters: {
        nama: nama || "Semua",
        tanggalMulai: tanggalMulai || "Tidak ditentukan",
        tanggalSelesai: tanggalSelesai || "Tidak ditentukan",
      },
      totalRecords: records.length,
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};