import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    await initDb();
    const db = getDb();

    const dbPath = path.join(process.cwd(), "data", "app.db");
    let fileSize = "0 KB";
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      fileSize = (stats.size / 1024).toFixed(2) + " KB";
    }

    const countRes = await db.execute("SELECT COUNT(*) as count FROM musteriler");
    const totalRows = Number(countRes.rows[0]?.count || 0);

    const schemaRes = await db.execute(
      "SELECT sql FROM sqlite_master WHERE type='table' AND name='musteriler'"
    );

    return NextResponse.json({
      success: true,
      databaseType: "SQLite 3",
      dbFilePath: dbPath,
      fileSize: fileSize,
      totalRows: totalRows,
      schema: schemaRes.rows[0]?.sql || "",
      viewUrls: {
        rawJsonApi: "/api/musteriler",
        dbInfoApi: "/api/db-info",
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Hata";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
