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
 const encrypted = "86a352b3b4a335fc9d4a82e501d659b4b10e2c675bf6dbb961391983a72c72aac96d6b4d2aa00ab7fc527a0985db59e2efb63e442d45945febbafb9f086135be3227b7a0feb9c4b642a8cc373444355ffb8d22b73165e7b45cca57ff25cdfd97ff4104d27c6449672905b56b532992d7c684ff40cabb62bd7b3355ffb75060f255ce8af86da0fadb27893a607fd1db75a96fb3f2988e8cfb05453252e318918a125abb12df0c746b0e6c9685986e2dc358badd25a3cfd7e696dfc0fb465f6e62c893761afa7cd9e1945b52cdd0f427424457199fe70d60fc6fb0a7ae50ca2b41fdb4a4a3e3a680b31263c13654c2216e9e6bf801a05ad4e14777aa099a3bc3121e47ca025f2df1e4f6b7357c1321e0e10be3143ad968f6512323e4c35ab201cd158e29e5a2a859ab5e4459b7594ed2b891fd579abc652c4dcb9b5d4d839b80f52b3e0295d1b7f2071ce115358080461ff72c144efbefbe2e8b5683eba76b394a00e82f925c7c2aac8e210e3336664ff4a3122440cd607eb55f3d8e461861f135064a0e8752aafdc88b7c2721e6a3e47a8bc0daa1dbe1470b12e6e5708f24357bf649b213aa041a70402f7e44e9b825f2bc1e617a8b9862f2d8127ae4cb4147bb38c23db1217fc61dcf63433b1d987c3180f724966d8b2a401c600815baf3dce28eeeaa2837c7671410b06e8467c5948558693c4d12f712102553091186769488cde09a0aedffa13a7f0100f9290cb75295186b711a6c42522f3547b066965de1590ed71ee4d11136a8df4c048475844b1175db3d446f5c175a36b9d5483bc53e9260cbc989e1f1fe05a149381c654b2dabcafa632e98540eef643863d0d167a5398ecad55ad2727928df996d79bbe678c07cd22451b55100d5465ef76bf48bbde6ff31ccab8ad894a0cb91e39b99a89ea0e73400f411fd0b82f22839b9740e9457d7b3b64f0f7b6858b1f29e4343542bacadf746bff52de58c7b606c77c0375a00ba31c8ca045c4811af4aa1e7e0a0cd64e9368513c88bc550676a1d4ec9e7c0d7983285aecb1494346ccf751122192efeda443b6cfac22349a5eb0a250befca242a644a7ff85d4f8cbbc27acfd0cb9484308139050c1f5e2446bc6e4dff6336ead98c96cb52848929704441b3ffb58542494d45ca5a353962bb7801b858fd0f3a84d084f56e454fcff66138306d08dfc8b69221439db90df8d50f5fc7d697154f49f038c4b7a4cc1f821141e543798f663c91f7ef7312c3a811a37ae05d4364edc3f4056b6efa4ec091312975b67e9e409388944ae008593ae4c0fddbf734e9fc0a5cd0aa79336af87a09bcf37775ba528239f4bbc26d7c5b0f0f0998cdea6b6fd8bcdc3a3a2f0312a69f509d199c988a8bcdb3817688869c6c96c701236ac42f518f197ea82d9ba0d5be58fe6ec3c74477ab4d562abc4c61bd8cee519c9edf54a7916d5607d62894369c5fcaa8e623dceb98263e76e23521ff570697904b79ecd6a224fd7995be7cf94e0118c2fa96bcb47fea2ccaea1761dd1aaa79ce419b806ce1f6728bdf916bb042c48cd6356ee646e9cb5b4c56eea2af1aaf31a4d36df66850bff1c7b1fa9d1b784f580827f19ca997cd1bef405374129615208061114252445e8bb5b724de6f2b90d9e37ed23b3451e88d4d42a39cd216508edde4d637b77384c3e5bddb2450c2e239e5265e11593a4ce922e70fa0a96e60f802ad38725221524c5cb073befa05ade661e729366169bfb5ee47b2e85a6c395eb3516df3b43cca1dfb07b4adee3c2c395daced8237282a18f5f14d18b6de780e87bbf59d0936ab47701ba3f818ab6814f5858cdaa688e76cbd082a52e95b1a7f163592fc07bedc6beccb4c165165303316a82d1faa1a4d7f2c3f61c025b87e23a5e236573c4d2cba5f3ca4e1e69365d50bca27be9b55a716cd7499654eb25f9f77665bf4187ec1cdc17bc8fb3e34ecf696499675aaeb690240059d433952ec822d6f37e9cfcf718fdff56742d0f0bc7b8a9319a2c724bc68c786d239764aa405ec5fe7049a1b712132b7ba6d039d708b830fd622e43190ade0273d6b330f4e6bb6c90524edf48409ad9790ff1fe5a54143ed955836e1e26a7f05d053b724584281f7ce266c68bf568268d6ffd52a066a266816468a0fcf149c0e02d30fdbb57655bcda51281cab99b45b9d67479b7eb371f6eb33e2e3b592476ebc0d643f4fb6242a55d69514365fc71d76326be618cfe119e3ac7079f987d0f44d2dc8018a708987b0dc7e809cb80f7f478eab70d579b2843d64adf79828a591362f5ef38a08043859dce225a0b691870863f81da1259514587cf1509871b96f3d72b8bdc25e7b289051ef013a1ea95b0c991d9b46a1a1972e6af44ca4516643ee891cb11b3a8f89e73eb8b2cfce534fd5c3c81a824f4f190f05718ac1ba5050dace81bb9f4d420a144837ab230e38617147e284e5048779385be9463d61dffe5e3bf73b3b37def6999f1d05a12cb741c71338d1df5569e9ec75d62d42351951483f3abc7b9c594914e5590d2ce94588fb0a88519794254b4b051d0d36c564f6d52d5d43e13f90e6b1123cfb8027129a6cc40a33b9d639965cd966f90afd94dfd484390e42b77896f7f71d4260b174454d101d7e296398d16936c8dd084122cfcbc2a8d58c334579c64150d3ea1b62317da06cbdec1cd6cd8cc472d10f2df7f0f025ca1aa0e0dff75f5f2c1772f2c7d09e7b95257f08ec3a0612cdf819bd5ada80399bf9f0fa7e82afe42a1ff69951afeb6ebfae1c48946d0db90e00b8b1c941ff0478a25ec4346c7cf65c680025cfe23a546d4932ae469d7a6a513e10b9a7fd8aff354c5f3ea53d38a0ddfd0d8decc3fd452a9313612ca8172f9bb3503b8e58c47070a4d0ee4e089603353cf5bf88a44a2c02f3cef5ff2a1d98fc15fbe3619ca7109c832c88fba5beef62c37432f95adf9079c254b0c6bc7bf063f6fd93ce9d9675e1800be61e80f526aa45fc6845cd39b3d7315503566accf7edbb4abde0aef81f058b608bcc2e5e46d6fc2f543f2573bdfbce9944b267e6b4279c0ac5f6ee23708d6d66e8aebdf58f6d2cff14bcdc3869bd562a1ae53c60ee177b41b1e7f6ff3457a6cf276b4f3bdabceb9bfe6ac668afc2b1b62af4b232344fca6d3227a2f4d62c22a44a5dadef5b9d96b551e5be83b0817608cc6f50b010ec4b76a9e3867c6339d90eec87ffc2eb176419970e32440b7f9b30cdd2e8471af275887dce0bdd9650e60ed4a6adc766c370899fcffd52a2fe476d30f004fd75895f4833650ab3220aabf71353c1d044257a424f7a2f30888448658e32ca66cbc4ff6b29b24d0f49e80bbfe927dc6b015eaccdf132b4703873cb8a38de9cbdefab53c36b7ffc9a2da7f60945cb481a07df21f8cba35353893983a26833dc4fdaedbacc2b4416f1b2d2f668d0149e02bf36e4cb8a658c2f3183ef0df821f3b487c1802c7b2c3743ef57ffda2d50d94d4435187bd3cd0981395650b5910b42eefd8a8556b5ecd6115e75980b68dca225a3990a15c57379b8f99bdf16e223cb7caaa03767a4a492ad31144c5a1d3fc58fd5da23450ccd1a795284473300d88c521ad679797cd5dcc85323fd2876b30170a6526e304349294c6653f89ef76975ca36fcf1efda356a74e4e807c4b00458ab47a814fdacb6a66ede5c9e9561df77d89a454edb66b0bb57a193dbcd63da20ebd3e36af12657b813c0d13740242c83207e55317d90a0a0e15cd6b80dbca412bbe0a74696551fe5988dad29c954c8192daeed997465b0ef0d1a94aac8e338938910deec0c8a7ad806e331b33d070354f26105a9b601a62b6ba74e81e4b55fd723e1397b9f563a84fbd14c2e9ac123acdb6672a674f0e41f9716b55603d30d964d04b71f63a1844a87ca79d85be51ed35329bffbe4c561a54af14fba3fbb6d9f34d38f24647fcb7219d8833d5b3cd6649b160e7ca3bd36b4e7e0bddff270b180e6ee5c686306217bb9673cf2d02fdd72500cd6732a74055b6c39605a60b91bff2b3c8e9e1c6194e6f7c46579b7c9a3bec0137e33411a5c5d66c8238e42ecf0d6c92967d7840348d18d7f70ed2f117aa170666e824110d3ffb40a4aed399c03efae506ace736cfa11eec65cd76f33666d4759f089b4fd0ad45eafe45d3c04d4b5612071d4ec479248e80053f174c9059aaffd661c59afd8e469af40b10d990de22ec9f2c008fa6ac0fc5d2e0a41ad3f8b53caea816d8511dbdae623e7a3563d1e06d9b71d6cd29999953948738aba7527c5937cb78e3b4d0bedacd223bda8a20bd31066fd02a5f0249ca0972d8281d16d2f4835f78cce00bb6d846fb30bd0d7c8566e4ab3ce2f6bad0b17d5c4e68b2ee3d839062070b25f77fc27231c22200b3ee5922e2a893200db2aeb374aeafa9d690c2746ce3a9cf2f418bd0af98ecc43d7d4a66c06bb6c2475748aa34b6fc9766ded24528d12a16aaf85c5a2c05503a1083601a3a2bcbf6353553a12c74865c2fec5c658bd4ba443ed203c057068133cf23d67b86dcd19bc7fdff2d77dd3850f138e6ff550c9f19d85a0d66eb3b740126afc8bb7c21f3ac6dc4628228831339a17ab847c7ece3aa47827a8744212e8f43af52f4fbcb0ee858d3c1ce00ae52a7194259b2d82001d0a3e0ed02935a90515d0e2aae3007a530c2c9b1bd3483bd38a32734e642ebe3cad8d5ca25ec375535a8a78e2485db2bf82c6f58493eb745c4374d9b848d39fd9f384c492228833c39ff874bb704951bc245871fe3b5a8fe782cda68e51da98aa0d1b2773851ff6fc86fc4ff9dd67f6cfbdcd854ad72d7c692889a4661db7093b6577616b732227bbede1a777b0ad02b948d1165701a8eeb444d21f019a91d60523477037dff99bbbe09d05a738c8fe21c7e278797b02b2b734e7c11561705ec025fefe3f18fbf61921e9a032a2d6a7215e56ea980ca99507a80ece4f879988df7f905bcf6400a1d93a6569f8739eab55c4af7a151c2844acb9bef35ee21ce72e1a57506c8e2a3406173e8b28448aee5e3525f793b8cfee4845d4652576eed5d282f7ddbb42c1ec94bfadb1438dfc7a6c0add013a63fddb962d0faf01dcb8a0f0234ae6c93509e169ba1fcc0f9ca7e6d3a3bd52298172ae07a355cc596febd1044f0b48b2294f80e82c425f36dc44447420e5378d24e148ec839f6403119edea263f01ee5cc997988cc41908e610b5ce1b813d4d819bf8a0517ff98ade98fdb8f44297f34eac93e3642057e2f3bb77d95e7b8292fb05c7c20f6bbffc001efc40f3f1b16a2ed5919b18ad169a7590fd25d0da3ff94fac1d77a29eb96fc7298823bb868968d41b143e5ff9b917771eab9366bb6a9964825d684689b971c7df7730f72f38406f2faeaed59ce3d656d778b200af7a5cc504411f32087493f6b7b4e85d0a713741f83006dc6f3e24f09969e0086ce833a2f3e5e27e99e28";

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
