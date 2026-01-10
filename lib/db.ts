import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("dial.db");
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS beans (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      roaster TEXT NOT NULL,
      roastDate TEXT,
      notes TEXT,
      isActive INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shots (
      id TEXT PRIMARY KEY NOT NULL,
      beanId TEXT NOT NULL,
      grindSetting INTEGER NOT NULL,
      doseGrams REAL NOT NULL,
      yieldGrams REAL NOT NULL,
      timeSeconds INTEGER NOT NULL,
      tasteTags TEXT NOT NULL DEFAULT '[]',
      shotCharacteristics TEXT NOT NULL DEFAULT '[]',
      isDialed INTEGER NOT NULL DEFAULT 0,
      drinkType TEXT,
      brewMethod TEXT DEFAULT 'espresso',
      notes TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (beanId) REFERENCES beans (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_shots_beanId ON shots (beanId);
    CREATE INDEX IF NOT EXISTS idx_shots_createdAt ON shots (createdAt);
    CREATE INDEX IF NOT EXISTS idx_beans_isActive ON beans (isActive);
  `);

  // Migration: Add brewMethod column if it doesn't exist
  try {
    await database.runAsync(
      "ALTER TABLE shots ADD COLUMN brewMethod TEXT DEFAULT 'espresso'"
    );
  } catch {
    // Column already exists, ignore
  }

  // Migration: Add shotCharacteristics column if it doesn't exist
  try {
    await database.runAsync(
      "ALTER TABLE shots ADD COLUMN shotCharacteristics TEXT NOT NULL DEFAULT '[]'"
    );
  } catch {
    // Column already exists, ignore
  }
}
