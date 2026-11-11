import { createClient, type Client } from "@libsql/client";
import path from "path";
import fs from "fs";

let dbInstance: Client | null = null;

export function getDb(): Client {
  if (!dbInstance) {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, "app.db");
    dbInstance = createClient({
      url: `file:${dbPath}`,
    });
  }
  return dbInstance;
}

export async function initDb() {
  const db = getDb();

  // Tablo oluştur
  await db.execute(`
    CREATE TABLE IF NOT EXISTS musteriler (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ad_soyad TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefon TEXT,
      departman TEXT NOT NULL,
      durum TEXT DEFAULT 'Aktif',
      olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // İlk açılışta tablo boşsa örnek veri ekle
  const countRes = await db.execute("SELECT COUNT(*) as count FROM musteriler");
  const count = Number(countRes.rows[0]?.count || 0);

  if (count === 0) {
    await db.batch([
      {
        sql: "INSERT INTO musteriler (ad_soyad, email, telefon, departman, durum) VALUES (?, ?, ?, ?, ?)",
        args: ["Mehmet Özdemir", "mehmet@ornek.com", "+90 532 111 2233", "Yönetim", "Aktif"],
      },
      {
        sql: "INSERT INTO musteriler (ad_soyad, email, telefon, departman, durum) VALUES (?, ?, ?, ?, ?)",
        args: ["Ayşe Yılmaz", "ayse@ornek.com", "+90 544 222 3344", "Satış & Pazarlama", "Aktif"],
      },
      {
        sql: "INSERT INTO musteriler (ad_soyad, email, telefon, departman, durum) VALUES (?, ?, ?, ?, ?)",
        args: ["Can Demir", "can@ornek.com", "+90 555 333 4455", "Teknik Destek", "Beklemede"],
      },
    ]);
  }
}
