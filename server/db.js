import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new Database(dbPath);

const initializeSchema = () => {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
};

const checkTableExists = () => {
  const result = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='features'").get();
  return !!result;
};

if (!checkTableExists()) {
  initializeSchema();
}

export default db;