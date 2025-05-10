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
 const encrypted = "86a352b3b4a335fc9d4a82e501d659b4063e4d6601065e1f7f19724a515ec44e5ce033576c58c415ec1ea466148285ec096b2fe40672d245e08fbad439a30febc11d9af18e2f5e35d38d55d91605e15a95cf5b00295aa8f35374194f8c948a152fffc2c0f7649c087e0b444583020ef88283c92b07505992cd45b423fe0e63d980638c1ab62bdde2bccf48270397d713777287eef6b3cf920483d7dd0a553f66b8416b76508a212f03a44cb648b744d3ea2a9fd06511b06ae271c89041e3f41a9743d89af24db152efc933e4eca637be8ce8bf8e0b3ff6cff51e665f7d4a24dc422bcc13005d1719cd67ab4b991c851a561e3ae88de9965a66aa7519b20bae4d4c1261766b2d7a026ffa01545fe35edaa9283fbe2924266751aed0293e7196a8654dc007ff6fe75b9523e37bce7a08c3e99f72a098fe75fbfd97e4eb71f8d53b223a918a38b3e85aecc55e6cc034d48ed356b382efc75456f57f73429d6da60dd80d8f4b59bb68d9afad1a70471864de6ba78aed3e3fe7479604e9d1abdd885983b099ab58d504b3e6a77ba2936527b04de30964838f74d9b1e1c7aa7df55921eb4016046a56fee0faca67f84e996eaafc0cea5440e89b7345129b1905cac968b3f3e42d43c67d0081866dd08e6eb800c70d10fff4d33872f8b3b22fd92241e33e573c140042fcf89523dabc6e789028ab6b55966606b2f573ba1825e6b41e8936547cffadc36000bd66140cc7f0d00f2dab4083a7ab515ffa73f0309d34c900fe83ce7e6c780a0a3352f79966afac74a61c31ffe7d3d0168d6ba2e7f91c3229edcd7303be1fced0c47d9f1c7066ee2e941f05bd0be56cbfe90bfee526c8257d676f523e853f9053a011fb93def3f58bacf48cb1711c9042be69173bc6dffaddd25473dfb42497c6a3f7e2c69123358f5209122b0e4f6e668a9867a0815b575c6c9eacfdb21248ef5424fca1167139a0eef19e534de604f32d0362ba0bfe4aba9f4474c48a77ea167bdc84d24ce99223a03dc4702f02913bbd33f154ef0f004692e3ee81b59cdf855dc5bdc00aa5f5a2d85fb77b7edc2100f222d5db9403b720c5253836470b4956031416381c3f111fd3e0fb937b11b7ad84797d4ff2943e36ceb647ba86e057bfdccb36140c0bcf803136c57dd470ce898b93fc1dc8ad81f6cbb0c4c95d7026dc69c9016bf1c474dee8e556288016fc4b06b4fc9704ea7467901be63af203588a814dc25ec09ba3bdf63f17ae3fd09302185de2dfdf9fd29198f1df2a1bc810df7abd44be9e1aecb2d334c985e50d083850084c8c757364e293f0d4869b08f40018269cf4e980d14ad3f2a4733687959c072390043934876f8a24ec74f7d1e07aac28cc802b9e7adb24c5067029a2a8166a4bfd2186c94e6a8d15e74204cabc595cf22a620a370a61917064c83e694f4992ed8930dc7e20162d3eb99e54ad24c11ad5af8bee8fc410f0f1c84b0c1e5ff1a1f4bc7f70eb7383a1d9bff59b56fb99b2e14cf7a2d99c714be84578fe3bd8e9e8e1dae46595f9f12b44c14ea0106b44c33959825f60b8d3958bd6227990dccd8601ec09795b3f6f6cc4d71cee18ac55be13394fb19f65f2980662a6eb1cb776823ac640a02b2d5752fe37fa13ca865f21c5d84ea27dc4cc210cc415175627a4d4ff405b62a74b8cc2bda25e3178e9d73ee5b220b70d74fe0ee2d994bd06e499af0618018c44d5060c4a0eb7b219dec18d54a200bd33313bdd48f2c82125e76128ef5ca2076b2c783c6e6750a66c624ce2201088d802097170d53eee345008eb872ce62196a2420e948f45bb6f0e54536746114db06b9fc42064dcd17f9792740932b5b9ef7f1fb468c3fabc2cf0408d9e3fb4d74cf9f1e93474422f4e1c1345e2a2ddd414deaef646fcf389962abb7bf8111c174494240c4d689450a431eabca4b6117e016201fd433fec14a98050b5eabb649df7749ef134518f5ea9c4b6c1438af98ed6af93bb419083e638f3039b198e0b0f07a9be0ddc42ff3db33a3b688eb448ca31626b491b0c9637503c50e9af1f32dbf1f454300c24a8feb23f0f0f18abc03bef63b72367305075a9eb1ac3fc4ebb3b230ce2b2ad0b41ba1381116c7a7ea6e5d0fdf23a48c28205f83eaa37f67dfad18bd7cdb5b0210c16e6c29886bebfe916b49574c20d2a148a0266fb6b442b4a5e5230219bbb6fdece6fd705cb6e595919eb3ecf5740a187a4bb5a14a28d0caa31fc8198e0070923a17f49c092545b34b2d74d70c8ef5eef77a1bffbda33a9834ec7f539b0d43960156e17a1911a8d4a5e1b5b9c124dec4733549a20ccdc542134c40727eaf8248a87ed22c868060d1930b7cf104e7c8dd5b4db1e9ff5450310309427f03ad7fb1b8f6776f01bd8b6ba1788dc94e8cf21820db0fb67c9d3f0fc7cf0256ceea4f04114a4678b7661da49f185f411d3f17abcd4d3ef69d7ba65ac41c1c855edff98c2f505a8003cf3645f3628c4f30dbd1a57de825f42a6198658f4ee90e64c1bb528f3fbd0e96391d0e91c27464fb0a6274745077371291f0a20ca98d6f2068413c4fa85d03c1b6c2c1ac29b7e63af";

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
