import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { pool } from './db.js'

const migrationPath = fileURLToPath(new URL('./migrations/001_init.sql', import.meta.url))

async function migrate() {
  const sql = await readFile(migrationPath, 'utf8')
  await pool.query(sql)
  console.log('Database migration completed')
}

migrate()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
