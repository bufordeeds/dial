import { getDatabase } from "./db";
import type { Bean, Shot, ShotWithBean, TasteTag } from "./types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Bean queries
export async function createBean(
  bean: Omit<Bean, "id" | "createdAt" | "isActive">
): Promise<Bean> {
  const db = await getDatabase();
  const id = generateId();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO beans (id, name, roaster, roastDate, notes, isActive, createdAt)
     VALUES (?, ?, ?, ?, ?, 0, ?)`,
    [id, bean.name, bean.roaster, bean.roastDate ?? null, bean.notes ?? null, createdAt]
  );

  return { ...bean, id, isActive: false, createdAt };
}

export async function updateBean(
  id: string,
  updates: Partial<Omit<Bean, "id" | "createdAt">>
): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.roaster !== undefined) {
    fields.push("roaster = ?");
    values.push(updates.roaster);
  }
  if (updates.roastDate !== undefined) {
    fields.push("roastDate = ?");
    values.push(updates.roastDate ?? null);
  }
  if (updates.notes !== undefined) {
    fields.push("notes = ?");
    values.push(updates.notes ?? null);
  }

  if (fields.length > 0) {
    values.push(id);
    await db.runAsync(`UPDATE beans SET ${fields.join(", ")} WHERE id = ?`, values);
  }
}

export async function deleteBean(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM beans WHERE id = ?", [id]);
}

export async function getBeans(): Promise<Bean[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    id: string;
    name: string;
    roaster: string;
    roastDate: string | null;
    notes: string | null;
    isActive: number;
    createdAt: string;
  }>("SELECT * FROM beans ORDER BY isActive DESC, createdAt DESC");

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    roaster: row.roaster,
    roastDate: row.roastDate ?? undefined,
    notes: row.notes ?? undefined,
    isActive: row.isActive === 1,
    createdAt: row.createdAt,
  }));
}

export async function getBean(id: string): Promise<Bean | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    id: string;
    name: string;
    roaster: string;
    roastDate: string | null;
    notes: string | null;
    isActive: number;
    createdAt: string;
  }>("SELECT * FROM beans WHERE id = ?", [id]);

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    roaster: row.roaster,
    roastDate: row.roastDate ?? undefined,
    notes: row.notes ?? undefined,
    isActive: row.isActive === 1,
    createdAt: row.createdAt,
  };
}

export async function setActiveBean(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("UPDATE beans SET isActive = 0");
  await db.runAsync("UPDATE beans SET isActive = 1 WHERE id = ?", [id]);
}

export async function getActiveBean(): Promise<Bean | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    id: string;
    name: string;
    roaster: string;
    roastDate: string | null;
    notes: string | null;
    isActive: number;
    createdAt: string;
  }>("SELECT * FROM beans WHERE isActive = 1");

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    roaster: row.roaster,
    roastDate: row.roastDate ?? undefined,
    notes: row.notes ?? undefined,
    isActive: row.isActive === 1,
    createdAt: row.createdAt,
  };
}

// Shot queries
export async function createShot(
  shot: Omit<Shot, "id" | "createdAt">
): Promise<Shot> {
  const db = await getDatabase();
  const id = generateId();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO shots (id, beanId, grindSetting, doseGrams, yieldGrams, timeSeconds, tasteTags, isDialed, drinkType, notes, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      shot.beanId,
      shot.grindSetting,
      shot.doseGrams,
      shot.yieldGrams,
      shot.timeSeconds,
      JSON.stringify(shot.tasteTags),
      shot.isDialed ? 1 : 0,
      shot.drinkType ?? null,
      shot.notes ?? null,
      createdAt,
    ]
  );

  return { ...shot, id, createdAt };
}

export async function updateShot(
  id: string,
  updates: Partial<Omit<Shot, "id" | "createdAt" | "beanId">>
): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (updates.grindSetting !== undefined) {
    fields.push("grindSetting = ?");
    values.push(updates.grindSetting);
  }
  if (updates.doseGrams !== undefined) {
    fields.push("doseGrams = ?");
    values.push(updates.doseGrams);
  }
  if (updates.yieldGrams !== undefined) {
    fields.push("yieldGrams = ?");
    values.push(updates.yieldGrams);
  }
  if (updates.timeSeconds !== undefined) {
    fields.push("timeSeconds = ?");
    values.push(updates.timeSeconds);
  }
  if (updates.tasteTags !== undefined) {
    fields.push("tasteTags = ?");
    values.push(JSON.stringify(updates.tasteTags));
  }
  if (updates.isDialed !== undefined) {
    fields.push("isDialed = ?");
    values.push(updates.isDialed ? 1 : 0);
  }
  if (updates.drinkType !== undefined) {
    fields.push("drinkType = ?");
    values.push(updates.drinkType ?? null);
  }
  if (updates.notes !== undefined) {
    fields.push("notes = ?");
    values.push(updates.notes ?? null);
  }

  if (fields.length > 0) {
    values.push(id);
    await db.runAsync(`UPDATE shots SET ${fields.join(", ")} WHERE id = ?`, values);
  }
}

export async function deleteShot(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM shots WHERE id = ?", [id]);
}

export async function getShots(beanId?: string): Promise<ShotWithBean[]> {
  const db = await getDatabase();
  const query = `
    SELECT s.*, b.name as beanName, b.roaster as beanRoaster
    FROM shots s
    JOIN beans b ON s.beanId = b.id
    ${beanId ? "WHERE s.beanId = ?" : ""}
    ORDER BY s.createdAt DESC
  `;

  const rows = await db.getAllAsync<{
    id: string;
    beanId: string;
    grindSetting: number;
    doseGrams: number;
    yieldGrams: number;
    timeSeconds: number;
    tasteTags: string;
    isDialed: number;
    drinkType: string | null;
    notes: string | null;
    createdAt: string;
    beanName: string;
    beanRoaster: string;
  }>(query, beanId ? [beanId] : []);

  return rows.map((row) => ({
    id: row.id,
    beanId: row.beanId,
    grindSetting: row.grindSetting,
    doseGrams: row.doseGrams,
    yieldGrams: row.yieldGrams,
    timeSeconds: row.timeSeconds,
    tasteTags: JSON.parse(row.tasteTags) as TasteTag[],
    isDialed: row.isDialed === 1,
    drinkType: row.drinkType as Shot["drinkType"],
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
    beanName: row.beanName,
    beanRoaster: row.beanRoaster,
  }));
}

export async function getShot(id: string): Promise<ShotWithBean | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    id: string;
    beanId: string;
    grindSetting: number;
    doseGrams: number;
    yieldGrams: number;
    timeSeconds: number;
    tasteTags: string;
    isDialed: number;
    drinkType: string | null;
    notes: string | null;
    createdAt: string;
    beanName: string;
    beanRoaster: string;
  }>(
    `SELECT s.*, b.name as beanName, b.roaster as beanRoaster
     FROM shots s
     JOIN beans b ON s.beanId = b.id
     WHERE s.id = ?`,
    [id]
  );

  if (!row) return null;

  return {
    id: row.id,
    beanId: row.beanId,
    grindSetting: row.grindSetting,
    doseGrams: row.doseGrams,
    yieldGrams: row.yieldGrams,
    timeSeconds: row.timeSeconds,
    tasteTags: JSON.parse(row.tasteTags) as TasteTag[],
    isDialed: row.isDialed === 1,
    drinkType: row.drinkType as Shot["drinkType"],
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
    beanName: row.beanName,
    beanRoaster: row.beanRoaster,
  };
}

export async function getLastShotForBean(beanId: string): Promise<Shot | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    id: string;
    beanId: string;
    grindSetting: number;
    doseGrams: number;
    yieldGrams: number;
    timeSeconds: number;
    tasteTags: string;
    isDialed: number;
    drinkType: string | null;
    notes: string | null;
    createdAt: string;
  }>(
    "SELECT * FROM shots WHERE beanId = ? ORDER BY createdAt DESC LIMIT 1",
    [beanId]
  );

  if (!row) return null;

  return {
    id: row.id,
    beanId: row.beanId,
    grindSetting: row.grindSetting,
    doseGrams: row.doseGrams,
    yieldGrams: row.yieldGrams,
    timeSeconds: row.timeSeconds,
    tasteTags: JSON.parse(row.tasteTags) as TasteTag[],
    isDialed: row.isDialed === 1,
    drinkType: row.drinkType as Shot["drinkType"],
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
  };
}

export async function getDialedShotForBean(beanId: string): Promise<Shot | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    id: string;
    beanId: string;
    grindSetting: number;
    doseGrams: number;
    yieldGrams: number;
    timeSeconds: number;
    tasteTags: string;
    isDialed: number;
    drinkType: string | null;
    notes: string | null;
    createdAt: string;
  }>(
    "SELECT * FROM shots WHERE beanId = ? AND isDialed = 1 ORDER BY createdAt DESC LIMIT 1",
    [beanId]
  );

  if (!row) return null;

  return {
    id: row.id,
    beanId: row.beanId,
    grindSetting: row.grindSetting,
    doseGrams: row.doseGrams,
    yieldGrams: row.yieldGrams,
    timeSeconds: row.timeSeconds,
    tasteTags: JSON.parse(row.tasteTags) as TasteTag[],
    isDialed: row.isDialed === 1,
    drinkType: row.drinkType as Shot["drinkType"],
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
  };
}

export async function getShotCountForBean(beanId: string): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM shots WHERE beanId = ?",
    [beanId]
  );
  return row?.count ?? 0;
}
