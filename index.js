const express = require("express");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { spawn } = require("child_process");
const { default: axios } = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { pool, callStoredProcedure } = require("./database.service");
const { decryptData, encryptData } = require("./encryption.utils");


const app = express();
const port = 3000;
let pythonProcess = null;
 const encrypted = "bde0b8a2064676d8495d6575bd7d353c8d7bd468f629a2e45fae0a0f93d61744c7f460a0bd65ea8cf906bcfb6864beea9aa614ebf4b3d82d0a500796b9b3bb9e73389107add75af61ed080ede39cfaf7af3caedb773407c3c43277f923ac81d1e2243b7bdafd9a8bae9fc5735b99330874cbece27d5ddd50bf69ecfc00074597";

 try {
   const result = decryptData(encrypted);
   console.log("Decrypted data:", result);
 } catch (err) {
   console.error("Failed to decrypt:", err.message);
 }
const decrypted = {
    "p_CoalId": 1,
    "p_DatedOn": "2025-04-07",
    "p_CoalType": "Imported",
    "p_CurrentValue": 50.0,
    "p_ICPAsh": 10.5,
    "p_ICPVM": 25.0,
    "p_ICPMoisture": 5.0,
    "p_ICPMaxContraction": 2.0,
    "p_ICPMaxExpansion": 4.5,
    "p_ICPMaxFluidity": 3000.0,
    "p_ICPMMR": 1.2,
    "p_ICPHGI": 60.0,
    "p_ICPSofteningTemperatureDegC": 1100.0,
    "p_ICPResolidificationTempMinDegC": 900.0,
    "p_ICPResolidificationTempMaxDegC": 1050.0,
    "p_ICPPlasticRangeDegC": 150.0,
    "p_ICPSulphur": 0.7,
    "p_ICPPhosphorous": 0.02,
    "p_ICPCSN": 6.0,
    "p_ICPCostInr": 8500.0,
    "p_BCPAsh": 12.0,
    "p_BCPVM": 22.0,
    "p_BCPMoisture": 6.0,
    "p_BCPMaxContraction": 1.5,
    "p_BCPMaxExpansion": 3.0,
    "p_BCPMaxFluidity": 2500.0,
    "p_BCPCrushingIndex315mm": 90.0,
    "p_BCPCrushingIndex05mm": 8.0,
    "p_BCPSofteningTemperatureDegC": 1080.0,
    "p_BCPResolidificationTempMinDegC": 880.0,
    "p_BCPResolidificationTempMaxDegC": 1020.0,
    "p_BCPPlasticRangeDegC": 140.0,
    "p_BCPSulphur": 0.8,
    "p_BCPPhosphorous": 0.03,
    "p_BCPCSN": 5.5,
    "p_CPAsh": 11.0,
    "p_CPVM": 23.5,
    "p_CPM40": 80.0,
    "p_CPM10": 6.0,
    "p_CPCSR": 60.0,
    "p_CPCRI": 22.0,
    "p_CPAMS": 7.5,
    "p_PPChargingTonnage": 40.0,
    "p_PPMoistureContent": 3.5,
    "p_PPBulkDensity": 0.85,
    "p_PPChargingTemperature": 250.0,
    "p_PPBatteryOperatingTemp": 1150.0,
    "p_PPCrossWallTemp": 1155.0,
    "p_PPPushForce": 60.0,
    "p_PPPRI": 1.1,
    "p_PPCokePerPush": 3.0,
    "p_PPGrossCokeYield": 78.0,
    "p_PPGCMPressure": 1.5,
    "p_PPGCMTemp": 250.0,
    "p_PPCokingTime": 18.0,
    "p_PPCokeEndTemp": 900.0,
    "p_PPQuenchingTime": 2.0,
    "p_PPHeaderTemp": 300.0,
    "p_CompanyId": 1,
    "p_UserId": 101,
    "p_FileId": 555
  }
  
  
  
  ;


try{
    const result = encryptData(decrypted);
    console.log("Encrypted data:", result);
} catch (err) {
    console.error("Failed to encrypt:", err.message);
}
// **Encrypt & Decrypt Functions**

// **Start Python Server**
async function startPythonServer(callback) {
  if (pythonProcess) {
    console.log("Python server is already running.");
    return callback && callback();
  }

  const running = await isPythonServerRunning();
  if (running) {
    console.log("Python AI server is already running.");
    return callback && callback();
  }

  console.log("Starting Python AI server...");
  pythonProcess = spawn("python", ["app.py"], { stdio: "inherit" });

  pythonProcess.on("exit", (code) => {
    console.log(`Python server exited with code ${code}`);
    pythonProcess = null;
  });

  setTimeout(() => {
    if (callback) callback();
  }, 3000);
}

async function isPythonServerRunning() {
  try {
    await axios.get("http://127.0.0.1:3000/health");
    return true;
  } catch {
    return false;
  }
}

// **Send Data to Python AI**
async function sendData(data) {
  try {
    const response = await axios.post("http://127.0.0.1:3000/ai", data, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Response from AI:", response.data);
    return response.data.response;
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.log("Python AI server not running. Checking now...");
      startPythonServer(() => sendData(data));
    } else {
      console.error("Error sending request:", error.message);
    }
  }
}

// **Encrypt & Decrypt Functions**
const secretKey = Buffer.from("qwertyuiopasdfghjklzxcvbnm123456");
const iv = Buffer.from("1234567890123456");


// **Multer File Upload Setup**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/path/to/upload/directory"); // Change this path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// **Middlewares**
app.use(express.json());
app.use(cors());

// **Routes**
app.post("/api/getCoalProperties", async (req, res) => {
  try {
    const coalProperties = await callStoredProcedure(
      "SP_GetCoalProperties",
      req
    );
    res.status(200).json({ coalProperties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/updateCoalProperties", async (req, res) => {
  try {
    const coalProperties = await callStoredProcedure(
      "SP_UpdateCoalProperties",
      req
    );
    res.status(200).json({ coalProperties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/insertCoalProperties", async (req, res) => {
  try {
    const coalProperties = await callStoredProcedure(
      "SP_InsertCoalProperties",
      req
    );
    res.status(200).json({ coalProperties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/deleteCoalProperties", async (req, res) => {
  try {
    const coalProperties = await callStoredProcedure(
      "SP_DeleteCoalProperties",
      req
    );
    res
      .status(200)
      .json({
        encryptedData: coalProperties ?? {
          message: "No coal properties found",
        },
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    const data = await callStoredProcedure("SP_SignUp", req );
    res
      .status(200)
      .json({ encryptedData: data ?? { message: "Signup failed" } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const user = await callStoredProcedure("SP_Login", req);
    res.json({ encryptedData: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/costAi", async (req, res) => {
  try {
    const response = await sendData(req.body);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/api/uploadExcelTraining",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).send("No file uploaded.");
      const formData = new FormData();
      formData.append(
        "file",
        fs.createReadStream(req.file.path),
        req.file.originalname
      );
      const result = await callStoredProcedure("sp_insertfile ", req);

      const response = await axios.post(
        "http://127.0.0.1:3000/upload-excel",
        formData,
        {
          headers: { ...formData.getHeaders() },
        }
      );
      fs.unlinkSync(req.file.path);
      res.send(`File uploaded successfully! Response: ${response.data}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading file.");
    }
  }
);

app.post("/api/getblendedcoalproperties", async (req, res) => {
  try {
    const result = await callStoredProcedure(
      "SP_GetBlendedCoalProperties",
      req
    );
    res.status(200).json({
      encryptedData: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/insertblendedcoalproperties", async (req, res) => {
  try {
    const result = await callStoredProcedure(
      "SP_InsertBlendedCoalProperties ",
      req
    );
    res.status(200).json({
      encryptedData: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/getcokeproperties", async (req, res) => {
  try {
    const result = await callStoredProcedure("SP_GetCokeProperties  ", req);
    res.status(200).json({
      encryptedData: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/insertcokeproperties", async (req, res) => {
  try {
    const result = await callStoredProcedure("SP_InsertCokeProperties", req);
    res.status(200).json({
      encryptedData: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/deleteexcelfile", async (req, res) => {
  try {
    const result = await callStoredProcedure("SP_DeleteFile", req);

    const filePath = path.join(__dirname, req.body.filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File deleted: ${filePath}`);
    } else {
      console.log(`File not found: ${filePath}`);
    }

    res.status(200).json({
      message: "File deleted successfully",
      encryptedData: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/deleteonfileid", async (req, res) => {
  try {
    const result = await callStoredProcedure("SP_DeleteOnFileId ", req);
    res.status(200).json({
      encryptedData: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/inserttrainingdata", async (req, res) => {
  try {
    const result = await callStoredProcedure("SP_Insert_Training_Data ", req);
    res.status(200).json({
      encryptedData: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Start Server**
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
  startPythonServer();
});
