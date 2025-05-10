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
 const encrypted = "86a352b3b4a335fc9d4a82e501d659b4f774eb10c8cb358111a4da15b53c5e0628fb3a0be473d66e51e9493bb83a0aa330314d086ba7afde194a1ef416cd3a403da97434fb034ba5b636a794278c389dce274c5dcf34e037a775d35318acae16d0fd90b31f50c0500e17e4fe1f762de12c7e0f1e52056e4614b7a73fce58e80c8d7d92cd12baa1e6563a972e436f9070cefdd3daeafe6849f5d3939c5854d708756afe424195cdce547592951d5fc8151643e9b96588be924e7b003c58fe2fff2783bfb6ef27d7e3e8b1c1d82d6e8de92ccd48fc3f529a740a31e196188a35d898165ce2a512d80eae36f818530a70b88a817a9dff8e7bb1615f11089cc032ede9460fa95aef29eb6edfeddc9763cfc433a7b2477bf5ae20e8ad13e364e5b95c7366a40ade215e0678fc33dac2c7fe24dd15cb1fcda17401d9eae549bc0adabcc187166abc2456c5dcf4928f0046faebada3514a8d0bdac8f5b50aba04e218e3fb327bcfb8cceb2787afc928d46cbf9450e2456a01e4f33ea799664677d128b5aa13233b33d0f95bfada02efbc7d5092907e8747f436ebc4b4d9239f366b3e8519dcd539048f3ad7588c7fbbbb26c1ad0eb5083cbc3bcb1dbe1f3b0c88b228e35d047d635002b26550a48c831204acb2a65f9a8868dff36064dfeea31599ae60825d6d46e34e1e888fa0333214644d38a8b40089a7d31de3d85f37c432fe69fe002e3ac4235cf928551e45467581056362c1cd56531e7648801d307c1d7a26e57faa5ae7508a0dd7d1797e86030afa8f44bfe507786f396f233f35a4db5e788050d5b257ea59593516c1d4d812c6a244f2a455866641e7a037a5dfa55c2daa6bccae612d28f635c34369ea44007cd3898cde21dc98aa1f68e52e45a70c63ac288862e4ff6c6db97fb9c3ab64c125dd852cfab5e7bcd5f921636bcb654c14d062ac5e3e41bc4f94d735bc8716c2078db269b9a29246d4d1d7031a35d69091633ade45144f8b22c4bed6e8b5439a60681c38e48a2e7731f49704312c39855d03b89830ba20d2ec148b5cb32bf3b13dbf98867c9accbc46016ca56ec26f8c38a8a9de8dce46397ae57d1b09c939da5d3267fd1723aa148c3859b8e8d83bfcca1f317a17349f879f930415c0cdb00ada9e633c054f6f65650035a1c3b3ecb271feadaaf6516cd85244d153a41cc9b374b9f5c46b42ed1a7aedf28e88f1257051e9799561963f4fef985d2819f9289ccd2c38bb5a04088eda7d53c038346f5230b88e4f424143f94b44f957f9843b55408819d3025cfc9986e38b6f87393740e0d5c4d5c7a9b2791d4f52915c63084eb65a8e52c3292ffd6861e67b51a0a3cd059d3caae7ab4420847cbfdc22000eb65e64ce0e1d20db2c0fbcf2557556562217a76241c004dbf854141117048c043028f6c4c36527b5cf149a93528f42bcae5b82d6ea375d559eaa92e6860991acd18e94b13f5ce39425736c15bf2fb694efff7d65ff7524a1ba71a7d67cfa63ced39e190f3031911d353b3ad1f6e91b2994b931b1f5eef91829d55bc4137e858ef7fe15a2a5a41dd9cf77da0eb76bb7f6c209824b4180f299e3f2704cf383a545c9f6ba93edf9dba223473d3fb02ae87d0eabd50f04bf8a5a845534ef8b599656313b3888aada896c73f2ace151a6a4af54aa0d6b0b49ea8f433ad6055ca85f5c8ebda9d1c136e6aefa6d538b37ade60f9805694aae13d5f5623acd9cb42c1ac73bac12ee7d67d9c81507a9954fdb4e6d9321971076617e55990a60013d1f111dcd8a7b87c9b39334939b4f2dc7acd3d28e55c4fe20632f56da7738970c9c955e5c59eb05e8a337203cbd1dd1c7ca659c36f516dcbf9effe473a55269d2812d4f3d066e50ac266cd0eb2d18a9adcaeb3a2bdaa01ff9172cb4545edba75550859fd1585d1fdf8543f39d9a0aab46f2f36e3bd6686d6e35c589cde9d045979f79f81a3338ed10a1a80c9146f6ffab06f23d73bf7b1034f13a5d1009cf973d3dcf427dcef2addf5fd02cfdaf1008dff74604ff33def92cc9438d91196989adcf2da83ebcc00795b5591726383740d8b9309036694ede6e913ac5e2eab19c1e7a26db701a4e93ffa8f0d6871d5cfd9efa1cc306ac1e45bbc90cd96d8f6eb9387f3ff133259b1800ae404d393a873fdfc87ef05ccd2884d9ab8fef02e3d2e45478ab6c6245827710de8189371769573e6f5900480f97e502fea3cab138044fabbe4fef72e157b9bd1b320d058e3140fc86cb02d76971de4c257727d8c5d75e141d0546d104b0802b00ba380449392df7934129a2f13b2c677ca2a2b69bef144d2acce75401d595fac856c6e37f24f442b3d00f539bee9820047d1b4a06b4012ed9f3e7ea401e3021a2e4b49dd021aa6e0b599d3e9432df0adef23c9c41d8b7547b1535513c636d942473905bccf0ed36af7802056b61eebc9ca41f9ed8405027581dc2d7abcce8e0271aeb79d0442142e1bc3277ac76639689b181df409a7845377433fb351b6e0b0204f4a96aafe5cb3d0c399f469348abe2a1b47cd61ac73d9c5c269c67738d9e0b0e1198d022487ab99760bdfbcfa5e098093be36ca96db2e95fb0c9214633b3de859ce848a82f104f70f387689af223338aebde6ff896c9a71cf30b83e2ec7a5834a6d47af9b3c52359c5d87f61c7efaa6bf4e46b46a5ccdfd804307fc2a81d21474636ff62fdeb8ac561879043cc06cabe853bda938788b27a434219c5bd992663bb0bc5f1f6762cc98c036ee8ab2cdcdb24da64bc74284bd88bc0da8956d464c73b38042e6f7d5adf9f92b9761b1d184e2c0f4eb2f6449b08cac0ef5cd0c971825e4e3455f097cb409aa639ca9d771264597932281cd89f328190d64dee46a3acba4d8dd7ca86b151ef3698f2d444616e0698785d59e92dd181eb4c6612e7a2239b06f8058ba225356ffacda9044905f493b95283980a7f694386791fa4d86b259845f3d93d78acfd72a6e9e4e04678f1f719807a0e7dcfbad4b4142bd116563fa67456120c77f1b9d23c068657b27ac2d253aeac63a55dc7d22b07d072783fdc07dd6566580970ed5334a4ae35da5bb227b8aee46f0f710bfac83bbd1eba1b69d4f9577e445b2731f6aa942304094a97de0bc783099e4e87ee2e9ca027681cc332b31e73874e12cd3ac2fe15a9f0a132f099d2bccc38722e610dd1841f32b4fc2eb8035143f6219a57000e386ecc45ed825d35d3cde4ce8bcb0efa85b1f9e54f77ff1c404bbf107c45fb3e77080ef6cf96406284b0b8132e94f57320d9bc9b6263c1a2c4418a073f131e7466a006d55f6727cc280fda6af58448a74fa6d939bc6be5ebe3749509017f0aaa80ed766d572f85edc78e47ccd730e7242581c36f3a2467f7e389683ea883b62c4a962c1a25b157bfcd3ba33149972ae57c0dd127d938df2d5be36f2b9bf6f6ee89b24228660925f9866ae8abda308de0c6b9c8a8040f2dc5f7e925af2d92fa22be63e4a417b7b19ddcc168ee6f78a2e11e5e33b81bff302e1595af976efc5f0ab9f95a745c880aebb02a7fe2168f4b6ea92aed116fced75f49c4b19024b8fa2194a644325f457edb6480e1d099e5848a4001079ffdafac6ac9f74cdd3514088dd38c45189a22d02e1f4a5901c88966c0f469c90d4768dab3fd4e9ef5fc9dd84eff76bc4a9ec23433192c926f4ff24db2f230affa1d87237672b7b71a4211cbde889dab6c774aaa3220285ac39984661b4416c1d318f192f65a30fe542673a26a591f186dd362d628082d94b9ef85c12ac364c00cf2ebe05185be5dd201537189209d739f965afab4eed412119e1a3445031e5d979110fbcf1281e0eb66e6586e6fb66af4f8d262beded2dc3c790457fb0383bb42d2443f8383941a50dcc1231349c846b9dc6f92c38b8410f648bc9957f95e7d77fa01349d4faeadf172f12dd372650d8876b26e89ff63c54ca67e7ad86bccd245d85228e4db9a47d45df8987ffb5729a162e94bc83c92ae620ab7e134658edab9b4f8b3c3c19b157b29f522b0958ee33ce465b8054aa34e7934ea5f14ed3a7d8b34f19cc08d634c71ed41136a9087315a1f1018f214ee570d52b4bec40240a1b3c706fe95c4c77eab5ea7072001672eb023c7ad63568181cf741b5e2807f7d7c464bd9891b717b8786904cdd464bcca63d37e2827f0fd1902631457ddbf9026fbd594934996fa739ba80f331d8e55a555cf1b483ad2d0822ab8c8aace17964b6947cd180058a0aaa5995cf08a54fbae4ba93ebac7eb38fae932a578b93f68e2d7c9e5be8826545bcdb193c28ae9ed0ea339366e83331a18ed6208a2fc9e1babff26abf0a28859bc4ee3ace69447dcbf1b572310fb2ec31081d1892dfb9af671904da5221a1ad84698ad32f58d5c477ad762a4c93ebda4c1edfa054c2a227552e58a481a345f2e0a3d729005a01185ae86e6060ba24700cc0ded070b3dbe808186d66ff3b9da4a06a89009e446efe4590081d9a21868db1597735d1e64ea8ee8f06653c43d9eb804a08add10c1f2ad7e7af735acdf092e06deea09396cf8076218edc97a4d08584cbe5a0349dac3d993ac0c6b915b8450d537fcbb84df76b059d6d227a2c41253a32876d03c30812df19c595383cb261295dab49db4176c1f6cecacd60a50406dd41db5c465e036ce0545ad91cbbb1f8986805f0c6ff36e5e04e01d34213d5960dbf61af4b2b1507279df9075463ef135d87871bcf71a141c37723e41fffbafc652470aae267c8d3b9904c0bd32d5ab327039f83ae46755ce387be98c17726f67f10dd49e3afab1ba6d0bfc44883f8cc36b39d4d6fc330a747f5430649aa575ada73c11470f0f4d2a9380cd1438fe0936a5422a4f5b76d7d72aa24af44f0567012d874b8dea3909c5afb2041f10e4b458e0738db1f5c7a6f63840abf6136a254cba827df7a7776812091403c97bf715ae7ca0126845ffea4e0ec47b1625e34ac6bfb741b9b337e9344f39f76ad97d3b2a97b5245c093e5d94454bd05625ea701a454eb1bc867d8441f2e67d710c6dc06d95172b5552092344b5459fb238955f34e8ad39e0ee0ee03f3e6062707606ed748c72e8f820f5e1a7da6abcf9553121b9e0001d4fb8289c7a693f84322639af74bce1e36e2f23bbfa14c4d93cf61019ea89005d24937e8d1102f359988973d8a70ff15375b3733822504ec89eae2657778bfed4b3c708d2ee50ab4344df622893ce69005651daedbdb809d04c32d793bab1ec9e785a9f4c6e4639c32778083b0f96285da1f60c04a2";

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
