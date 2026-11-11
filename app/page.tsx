"use client";

import { useState, useEffect, useCallback } from "react";

interface Musteri {
  id: number;
  ad_soyad: string;
  email: string;
  telefon: string;
  departman: string;
  durum: string;
  olusturma_tarihi: string;
}

interface DbInfo {
  databaseType: string;
  dbFilePath: string;
  fileSize: string;
  totalRows: number;
  schema: string;
}

export default function Home() {
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbInfo, setDbInfo] = useState<DbInfo | null>(null);

  // Form durumu
  const [adSoyad, setAdSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [departman, setDepartman] = useState("Satış & Pazarlama");
  const [durum, setDurum] = useState("Aktif");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Arama filtresi
  const [search, setSearch] = useState("");

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  // Veritabanındaki müşterileri çek
  const fetchMusteriler = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${basePath}/api/musteriler`);
      const data = await res.json();
      if (data.success) {
        setMusteriler(data.data);
      }
    } catch {
      setMessage({ text: "Veriler çekilirken bir hata oluştu.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [basePath]);

  // Veritabanı meta bilgilerini çek
  const fetchDbInfo = useCallback(async () => {
    try {
      const res = await fetch(`${basePath}/api/db-info`);
      const data = await res.json();
      if (data.success) {
        setDbInfo(data);
      }
    } catch {
      // sessizce geç
    }
  }, [basePath]);

  useEffect(() => {
    fetchMusteriler();
    fetchDbInfo();
  }, [fetchMusteriler, fetchDbInfo]);

  // Yeni Müşteri Ekle (INSERT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adSoyad || !email) {
      setMessage({ text: "Lütfen Ad Soyad ve E-posta alanlarını doldurun.", type: "error" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`${basePath}/api/musteriler`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad_soyad: adSoyad,
          email,
          telefon,
          departman,
          durum,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: "✅ Yeni kayıt başarıyla SQL veritabanına eklendi!", type: "success" });
        setAdSoyad("");
        setEmail("");
        setTelefon("");
        fetchMusteriler();
        fetchDbInfo();
      } else {
        setMessage({ text: data.error || "Ekleme başarısız oldu.", type: "error" });
      }
    } catch {
      setMessage({ text: "Bağlantı hatası oluştu.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Müşteri Sil (DELETE)
  const handleDelete = async (id: number) => {
    if (!confirm("Bu kaydı veritabanından kalıcı olarak silmek istiyor musunuz?")) return;

    try {
      const res = await fetch(`${basePath}/api/musteriler?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Kayıt (ID: ${id}) veritabanından silindi.`, type: "success" });
        fetchMusteriler();
        fetchDbInfo();
      } else {
        setMessage({ text: data.error || "Silme başarısız.", type: "error" });
      }
    } catch {
      setMessage({ text: "Silme işlemi sırasında hata oluştu.", type: "error" });
    }
  };

  const filteredMusteriler = musteriler.filter(
    (m) =>
      m.ad_soyad.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.departman.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ÜST BAŞLIK */}
        <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              SQL VERİTABANI BAĞLANTISI AKTİF
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Müşteri &amp; Kayıt Yönetim Portalı
            </h1>
            <p className="mt-1 text-slate-400 text-sm">
              Bu uygulama gerçek bir SQLite veritabanına bağlıdır. Tüm ekleme, silme ve listelemeler doğrudan SQL ile çalışır.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href={`${basePath}/api/musteriler`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 text-xs font-mono transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Ham JSON Verisini Gör (API)
            </a>
          </div>
        </header>

        {/* VERİYİ NEREDEN GÖREBİLİRİM? BİLGİ KARTLARI */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Verileri Nereden ve Nasıl Görebilirsiniz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-blue-400 block mb-1">1. Canlı Yönetim Tablosu (Bu Sayfa)</span>
              <p className="text-slate-400">
                Aşağıdaki tablo doğrudan veritabanındaki <code className="text-slate-300 font-mono">musteriler</code> tablosunu anlık listeler.
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-emerald-400 block mb-1">2. Ham JSON API Uç Noktası</span>
              <p className="text-slate-400">
                Tarayıcıda{" "}
                <a href={`${basePath}/api/musteriler`} target="_blank" className="text-emerald-300 underline font-mono">
                  {basePath || ""}/api/musteriler
                </a>{" "}
                adresini açarak tüm verileri ham JSON olarak görebilirsiniz.
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-purple-400 block mb-1">3. Sunucudaki SQLite Dosyası</span>
              <p className="text-slate-400 font-mono">
                {dbInfo?.dbFilePath || "data/app.db"} ({dbInfo?.fileSize || "SQLite"})
              </p>
            </div>
          </div>
        </section>

        {/* BİLDİRİM MESAJI */}
        {message && (
          <div
            className={`p-4 rounded-lg text-sm border flex items-center justify-between ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-xs opacity-70 hover:opacity-100 cursor-pointer">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL: YENİ KAYIT EKLEME FORMU */}
          <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-xl p-6 h-fit">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-bold">+</span>
              Veritabanına Kayıt Ekle
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Ad Soyad *</label>
                <input
                  type="text"
                  value={adSoyad}
                  onChange={(e) => setAdSoyad(e.target.value)}
                  placeholder="Örn: Burak Kaya"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">E-posta Adresi *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Örn: burak@sirket.com"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Telefon</label>
                <input
                  type="text"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  placeholder="Örn: 0532 999 8877"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Departman</label>
                <select
                  value={departman}
                  onChange={(e) => setDepartman(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option>Satış &amp; Pazarlama</option>
                  <option>Yönetim</option>
                  <option>Teknik Destek</option>
                  <option>Yazılım &amp; IT</option>
                  <option>Muhasebe</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Durum</label>
                <select
                  value={durum}
                  onChange={(e) => setDurum(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option>Aktif</option>
                  <option>Beklemede</option>
                  <option>Pasif</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold transition cursor-pointer text-sm"
              >
                {submitting ? "SQL'e Kaydediliyor..." : "Veritabanına Kaydet (INSERT)"}
              </button>
            </form>
          </div>

          {/* SAĞ: VERİTABANI TABLOSU (CANLI VERİ GÖRÜNTÜLEYİCİ) */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-bold">SQL</span>
                    Müşteri Veritabanı Tablosu
                  </h2>
                  <span className="text-xs text-slate-400">
                    Toplam {musteriler.length} kayıt veritabanında saklanıyor.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tabloda ara..."
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => { fetchMusteriler(); fetchDbInfo(); }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    title="Yenile"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tablo */}
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Ad Soyad</th>
                      <th className="py-3 px-3">E-posta</th>
                      <th className="py-3 px-3">Departman</th>
                      <th className="py-3 px-3">Durum</th>
                      <th className="py-3 px-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          Veritabanından yükleniyor...
                        </td>
                      </tr>
                    ) : filteredMusteriler.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-500">
                          Veritabanında kayıt bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredMusteriler.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/50 transition">
                          <td className="py-3 px-3 font-mono text-slate-400 font-bold">#{item.id}</td>
                          <td className="py-3 px-3 font-medium text-white">{item.ad_soyad}</td>
                          <td className="py-3 px-3 text-slate-300 font-mono">{item.email}</td>
                          <td className="py-3 px-3 text-slate-400">{item.departman}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                item.durum === "Aktif"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                  : item.durum === "Beklemede"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {item.durum}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10 transition cursor-pointer"
                              title="Sil"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alt Tablo Bilgisi */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
              <span>SQL Tablosu: <code className="text-slate-400 font-mono">musteriler</code></span>
              <span>Motor: <code className="text-slate-400 font-mono">{dbInfo?.databaseType || "SQLite"}</code></span>
            </div>
          </div>

        </div>

        {/* VERİTABANI ŞEMASI KUTUSU */}
        {dbInfo?.schema && (
          <section className="bg-slate-900/30 border border-slate-800/70 rounded-xl p-5">
            <h3 className="text-xs font-mono uppercase text-slate-400 mb-2">
              Çalışan SQL Şeması (CREATE TABLE DDL):
            </h3>
            <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs font-mono text-emerald-400 overflow-x-auto">
              {dbInfo.schema}
            </pre>
          </section>
        )}

      </div>
    </div>
  );
}
