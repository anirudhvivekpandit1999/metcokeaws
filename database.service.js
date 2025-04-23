const mysql = require("mysql2/promise");
const dbConfig = require("./db.config");
const { encryptData, decryptData } = require("./encryption.utils");

const pool = mysql.createPool({
   host: "localhost",
   user: "metcoke",        // <-- Update this
   password: "Metcoke@1234",// <-- Update this
   database: "Metcoke",
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0
 });


async function callStoredProcedure(procedureName, req) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const decryptedBody = decryptData(req.body.encryptedData);
    const replacements = Object.values(decryptedBody);
    
    const placeholders = replacements.map(() => "?").join(", ");
    const query = `CALL ${procedureName}(${placeholders})`;
    
    const [rows] = await connection.execute(query, replacements);
    
    return rows.length > 0 ? encryptData(rows) : { message: "No data found" };
  } catch (error) {
    console.error(`Error executing ${procedureName}:`, error);
    throw new Error(`Database error: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  pool,
  callStoredProcedure
};