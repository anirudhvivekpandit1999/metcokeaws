const crypto = require("crypto");

const secretKey = Buffer.from("qwertyuiopasdfghjklzxcvbnm123456"); 
const iv = Buffer.from("1234567890123456"); 


function encryptData(data) {
  try {
    const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);

    let encrypted = cipher.update(JSON.stringify(data), "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Encryption failed");
  }
}

function decryptData(encryptedData) {
  try {
    const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
let decrypted = decipher.update(encryptedData, "hex", "utf-8"); 
decrypted += decipher.final("utf-8");
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Decryption failed");
  }
}

module.exports = {
  encryptData,
  decryptData
};