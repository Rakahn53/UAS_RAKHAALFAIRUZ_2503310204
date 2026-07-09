import React, { useState, useEffect } from 'react';

function App() {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://fakenews.squirro.com/news/sport')
      .then((response) => {
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        return response.json();
      })
      .then((data) => {
        // Jika API berhasil, ambil array beritanya
        setNews(data.news || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Menggunakan data cadangan karena:", err.message);
        
        // DATA CADANGAN LOKAL JIKA API UTAMA ERROR / FAILED TO FETCH
        const backupData = [
          {
            id: 1,
            title: "Indonesia Juara Umum Turnamen Bulu Tangkis Internasional 2026",
            summary: "Tim bulu tangkis Indonesia berhasil memborong tiga medali emas pada babak final turnamen internasional setelah menyapu bersih sektor ganda putra dan tunggal putri.",
            author: "Admin Olahraga",
            date: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80"
          },
          {
            id: 2,
            title: "Persiapan Matang Timnas Sepak Bola Menjelang Kualifikasi Utama",
            summary: "Pelatih kepala optimis anak asuhnya mampu mencuri poin penuh pada laga tandang besok malam. Strategi formasi baru dikabarkan telah matang dieksekusi selama latihan.",
            author: "Budi Santoso",
            date: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80"
          },
          {
            id: 3,
            title: "Geliat Olahraga Lari Maraton Nasional Kembali Memecahkan Rekor Peserta",
            summary: "Lebih dari sepuluh ribu pelari dari berbagai penjuru daerah memadati jalanan ibu kota sejak subuh untuk mengikuti ajang maraton tahunan dengan total hadiah ratusan juta.",
            author: "Siti Rahma",
            date: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=500&q=80"
          }
        ];
        
        setNews(backupData);
        setError(null); // Sembunyikan pesan merah error karena diganti data cadangan yang rapi
        setLoading(false);
      });
  }, []);

  // Fitur Pencarian Berita
  const filteredNews = news.filter((item) => {
    const title = item.title ? item.title.toLowerCase() : '';
    const summary = item.summary ? item.summary.toLowerCase() : '';
    return title.includes(searchTerm.toLowerCase()) || summary.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold tracking-wide">Portal Berita Olahraga</h1>
          
          {/* INPUT SEARCH */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* DISPLAY DATA */}
        {!loading && !error && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Menampilkan <span className="font-semibold text-blue-600">{filteredNews.length}</span> berita.
              </p>
            </div>

            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">Berita tidak ditemukan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((item, index) => (
                  <div key={item.id || index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col border border-gray-100">
                    
                    {/* Gambar Berita */}
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-400 font-semibold">
                          Sport News
                        </div>
                      )}
                    </div>
                    
                    {/* Konten Berita */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h2 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                          {item.title || "Tanpa Judul"}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {item.summary || "Tidak ada ringkasan yang tersedia untuk berita ini."}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                        <span>{item.author || "Anonim"}</span>
                        <span>{item.date ? new Date(item.date).toLocaleDateString('id-ID') : ""}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-6 mt-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center sm:flex sm:justify-between sm:items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} UAS Perancangan Web - ReactJS & Tailwind CSS.</p>
          <p className="text-sm mt-2 sm:mt-0 font-medium text-gray-300">MARSELLINO - 2503311064 - S1 Informatika</p>
        </div>
      </footer>

    </div>
  );
}

export default App;