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
 const encrypted = "86a352b3b4a335fc9d4a82e501d659b4ae7edf0b038505ee8d242b231b853a7e10210e9d126fe46c5bc88f9837b4b547bccb9138aaf1730261f9f35aa9a74bc41e320fdd37d10493f95c8dd4cc7b7ec65e547375115ce5d4cf685d0e2cae3d22af270ffcba1ae62b3f29c5c23896e3e3f9c69a2dfe1d6bb64a6a6acec7d2ba098d243ae9e71bc2407de18ab4a93ff30b59f67329aed3c8dda0878fedac87c2d82293d3212636b7f1f3ee20a78f25fb7984d9ae46bd8b2fd2df5bad0afb5090ea";

 try {
   const result = decryptData(encrypted);
   console.log("Decrypted data:", result);
 } catch (err) {
   console.error("Failed to decrypt:", err.message);
 }
const decrypted = {
  "companyId":1
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
    await axios.get("http://127.0.0.1:3001/health");
    return true;
  } catch {
    return false;
  }
}

// **Send Data to Python AI**
async function sendData(data) {
  try {
    const response = await axios.post("http://13.232.169.135:3001/ai", data, {
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

app.post("/api/getMinMaxValues", async (req, res) => {
  try {
    const coalProperties = await callStoredProcedure(
      "SP_GetMinMaxValues",
      req
    );
    res.status(200).json({ coalProperties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/loadCoalProperties", async (req, res) => {
  try {
    const coalProperties = await callStoredProcedure(
      "SP_LoadProposedProperties",
      req
    );
    res.status(200).json({ coalProperties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/getCoalPropertiescsv", async (req, res) => {
  try {
    const response = await callStoredProcedure(
      "SP_GetCoalPropertiesCSV",
      req
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/getCoalCount", async (req, res) => {
  try {
    const response = await callStoredProcedure(
      "SP_GetCoalCount",
      req
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/getCokePropertiescsv", async (req, res) => {
  try {
    const response = await callStoredProcedure(
      "SP_GetCokePropertiesCSV",
      req
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.post("/api/getBlendedCoalPropertiescsv", async (req, res) => {
  try {
    const response = await callStoredProcedure(
      "SP_GetBlendedCoalPropertiesCSV",
      req
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/getCoalPercentagescsv", async (req, res) => {
  try {
    const response = await callStoredProcedure(
      "SP_GetCoalPercentagesCSV",
      req
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/getIndividualCoalPropertiescsv", async (req, res) => {
  try {
    const response = await callStoredProcedure(
      "SP_GetIndividualCoalPropertiesCSV",
      req
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/getNonRecoveryStampChargecsv", async (req, res) => {
  try {
    const response = await callStoredProcedure(
      "SP_GetNonRecoveryStampChargeCSV",
      req
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/getRecoveryStampChargecsv", async (req, res) => {
  try {
    const response = await callStoredProcedure(
      "SP_GetRecoveryStampChargeCSV",
      req
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/getRecoveryTopChargecsv", async (req, res) => {
  try {
    const response = await callStoredProcedure(
      "SP_GetRecoveryTopChargeCSV",
      req
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/getMinMaxValuescsv", async (req, res) => {
  try {
    const response = await callStoredProcedure(
      "SP_GetMinMaxValuesCSV",
      req
    );
    res.status(200).json({ response });
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



app.post("/api/updateMinMaxValues", async (req, res) => {
  try {
    const coalProperties = await callStoredProcedure(
      "SP_UpdateMinMaxValues",
      req
    );
    res.status(200).json({ coalProperties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/addExtraColumns", async (req, res) => {
  try {
    const coalProperties = await callStoredProcedure(
      "SP_AddNewColumn",
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

app.post("/api/getTrainingData", async (req, res) => {
  try {
    const result = await callStoredProcedure("SP_GetTrainingData ", req);
    res.status(200).json({
      encryptedData: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/getIndividualCoalProperty", async (req, res) => {
  try {
    const result = await callStoredProcedure("SP_GetIndividualCoalProperties ", req);
    res.status(200).json({
      encryptedData: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/getIndividualCoalPropertiesByName", async (req, res) => {
  try {
    const result = await callStoredProcedure("SP_GetIndividualCoalPropertiesByName ", req);
    res.status(200).json({
      encryptedData: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// **Start Server**
app.listen(3000, '0.0.0.0', () => {
  console.log('Server listening on port 3000');
});
