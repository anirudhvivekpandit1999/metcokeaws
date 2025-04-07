const crypto = require("crypto");

const secretKey = Buffer.from("qwertyuiopasdfghjklzxcvbnm123456", "utf-8");
const iv = Buffer.alloc(16, 0); // IV filled with zeros

function decryptData(encryptedData) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return JSON.parse(decrypted);
}

// Your encrypted string
const encryptedText = "bde0b8a2064676d8495d6575bd7d353c8d7bd468f629a2e45fae0a0f93d61744c7f460a0bd65ea8cf906bcfb6864beea9aa614ebf4b3d82d0a500796b9b3bb9e73389107add75af61ed080ede39cfaf7af3caedb773407c3c43277f923ac81d1e2243b7bdafd9a8bae9fc5735b99330874cbece27d5ddd50bf69ecfc00074597";

try {
    const decryptedData = decryptData(encryptedText);
    console.log("Decrypted Data:", decryptedData);
} catch (error) {
    console.error("Decryption failed:", error.message);
}
