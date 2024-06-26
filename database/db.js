const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  })
  .promise();

async function checkDatabaseConnection() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("Database is alive");
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
}


async function insertHistoryTimbang(hasil_timbang_id, operation, value) {
  const sql =
    "INSERT INTO timbang_history (hasil_timbang_id, operation, value) VALUES (?, ?, ?)";
  const params = [hasil_timbang_id, operation, value];
  const [result] = await pool.execute(sql, params);
  return result;
}

async function insertHistoryInventori(inventori_id, operation, value) {
  const sql =
    "INSERT INTO inventory_history (inventory_id, operation, value) VALUES (?, ?, ?)";
  const params = [inventori_id, operation, value];
  const [result] = await pool.execute(sql, params);
  return result;
}

const getInventory = async () => {
  const query = 'SELECT name, hasil, target_value FROM inventory';
  const [rows] = await pool.execute(query);
  return rows;
};

async function getTimbang() {
  const [rows] = await pool.query("SELECT name, hasil, target_value FROM hasil_timbang");
  return rows;
}

async function updateSembelih(id, sembelih) {
  const sql = "UPDATE progres_sapi SET sembelih = ? WHERE id = ?";
  const params = [sembelih, id];
  const [result] = await pool.execute(sql, params);
  return result;
}

module.exports = {
  checkDatabaseConnection,
  insertHistoryTimbang,
  insertHistoryInventori,
  getInventory,
  getTimbang,
  updateSembelih,
};
