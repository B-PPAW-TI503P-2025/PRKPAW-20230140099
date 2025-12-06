import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

    // State untuk modal foto
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReports = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const baseUrl = "http://localhost:3001/api/reports/daily";
      const url = query ? `${baseUrl}?nama=${query}` : baseUrl;

      const response = await axios.get(url, config);
      setReports(response.data.data);
      setError(null);
    } catch (err) {
      setReports([]);
      setError(
        err.response ? err.response.data.message : "Gagal mengambil data"
      );
    }
  };

  useEffect(() => {
    fetchReports("");
  }, [navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

    // Fungsi untuk membuka modal foto
  const openPhotoModal = (photoPath) => {
    if (photoPath) {
      setSelectedPhoto(`http://localhost:3001/${photoPath}`);
      setIsModalOpen(true);
    }
  };

  // Fungsi untuk menutup modal
  const closePhotoModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  // Menutup modal dengan tombol ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closePhotoModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi Harian
      </h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
      )}

      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latitude
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Longitude
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bukti Foto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((presensi) => (
                  <tr key={presensi.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {presensi.user ? presensi.user.nama : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(presensi.checkIn).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkOut
                        ? new Date(presensi.checkOut).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                          })
                        : "Belum Check-Out"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.latitude || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.longitude || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.buktiFoto ? (
                        <img
                          src={`http://localhost:3001/${presensi.buktiFoto}`}
                          alt="Bukti Foto"
                          className="h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openPhotoModal(presensi.buktiFoto)}
                          title="Klik untuk memperbesar"
                        />
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada foto</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal untuk menampilkan foto ukuran penuh */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closePhotoModal}
        >
          <div 
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close */}
            <button
              onClick={closePhotoModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-3xl font-bold"
              title="Tutup (ESC)"
            >
              ✕
            </button>
            
            {/* Foto Ukuran Penuh */}
            <img
              src={selectedPhoto}
              alt="Bukti Foto Full Size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Info */}
            <div className="mt-4 text-center text-white text-sm">
              <p>Klik di luar foto atau tekan ESC untuk menutup</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;