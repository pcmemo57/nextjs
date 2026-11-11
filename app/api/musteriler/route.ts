import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
    const db = getDb();
    const res = await db.execute("SELECT * FROM musteriler ORDER BY id DESC");
    return NextResponse.json({
      success: true,
      count: res.rows.length,
      data: res.rows,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Veritabanı hatası";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const db = getDb();
    const body = await request.json();

    const { ad_soyad, email, telefon, departman, durum } = body;

    if (!ad_soyad || !email) {
      return NextResponse.json(
        { success: false, error: "Ad Soyad ve E-posta zorunludur." },
        { status: 400 }
      );
    }

    const insertRes = await db.execute({
      sql: `INSERT INTO musteriler (ad_soyad, email, telefon, departman, durum) 
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        ad_soyad,
        email,
        telefon || "",
        departman || "Genel",
        durum || "Aktif",
      ],
    });

    const newId = insertRes.lastInsertRowid ? Number(insertRes.lastInsertRowid) : 0;
    const fetchRes = await db.execute({
      sql: "SELECT * FROM musteriler WHERE id = ?",
      args: [newId],
    });

    return NextResponse.json({
      success: true,
      message: "Kayıt başarıyla veritabanına eklendi!",
      data: fetchRes.rows[0],
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Ekleme hatası";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await initDb();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID parametresi gereklidir." },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "DELETE FROM musteriler WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({
      success: true,
      message: `ID ${id} başarıyla silindi.`,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Silme hatası";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
