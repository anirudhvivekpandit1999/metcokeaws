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
 const encrypted = "86a352b3b4a335fc9d4a82e501d659b4290f5dd285bb746029f780aae7bc445482b100f0519409d74d30e78f29f276493bd326ba34102e65d8e7269fd822d1ceb6a02894d699a84e763405f1ae9a2895ea172eecac28605c884a6ffbfd1d71ce9366eb995020c09246d87ec520a692b5749d2cdcf4018a5de078101a4310f68dfd48dc438fe86875b9f21656861da52616c22814d5046d1bb950c0a6c00c84ac0808a3ac14d0c091704a0ec15720c313cfda127d008fd7f81fb784a345a4323331df4a9b244d2d66197dd994f1b86f6c3cfc8836a22c369d53c439b3343a06e067389fec099b831957c5ef91f87f661e1c5cb3eb97f9c18fd5183d06889594c4583c00ee011eb02052ad12d2f810eebf28f32e1795bdcf44e8aff5216a2b119bef0c39ce74060e10f07522b77e3696d01cc2f52f242cf050788078bf727966ede3a4df60610f163da8b515eaf74e98545c78a3ff36160835f40d307abe8095c60fd082577e3b7f2dd60ba9056d18349757d187bcca7e43718469c3df9d91f8b695f3cd80e7f353c9c838fa76d50110b7921c7e3e6eb9f4acf62ee3b3fff009ff8deecedf871704fb48c3dbab1a0499f89e5377e414283c35f9021e4f510774d9ea1de973ecdc77f39f727a39aaba082ee614449f1a4f72f813fca1ff56471705f9b81076bc542d927fe23aa6c07752c0c18f9cffd2f252676ea18f3ef6d85d90ff41c98509570c10b88cd2ef5701e0fa0f84fdd2dcfa43463eaa4098ca59d84e5d0b0b9f674cc110c70e93a41e94dd5ba50163977e2294dd61ab58fae75b20fa276c40630ed1d5186cbb77707f04d84fb2f7afaf68511cfe10019e5ebdc9d8f03702366c724c536d4dd37009ac015d74d1d124470e12ebaf7195d856b250d0af01999ed3ef89779ff4031d0f3a29fe0f2bde8860a30f15f6735ce479a6b8bc843f75a72975e55fbb73f63b3c95f01495e381be07066209e447189e17024713b98e172f446b4b16ac4c7211b4e03167a43effe765c902240c16902d7601a1bad681ef80330dfc7e4d49134d8935fc92aadeae42d608fc49dd99e3124419b1b1bf355ecdb666ef2f3b66da80dc7b10116b325650842261ec7e262f59949ead2f0118bcf5f79f34f07a6f374f81446c3758ead90d4679a4758156a9f9a5a0ff951fe9f54c722abb7dccb28816e8aada9440837fcdd33a1922124d82079c7a6e0b7d5a78d25b58cd67b7067522181a6cc1af6eb71c9c2ca8586f336779e47911e241187ada68c4069d170450ea4ac2ebf2dca54b97233a9843f9f9da99615aa67cdca64a2e427c7b386561519c13c2ee48d2af85479af97f5e9669e91182ce84b7b8a6de2df3454901a8fba47c6ed1e9ce4a20bc0d27950c85635085330aa54cd24e5a08c8419e9c400862fc78cbae9731bfcd170abe573ed13ea47ace44867d773ca2c6a12bfa13168823bbe3775314fa2d2911767108f6c49bcd3885f272d8b81c46387eea0d3b958a85eb8d2ef963987c8f47b58616d980f533920ece21a0992595989b3b767fa78eb6a4594c0e051f1d6710a7a5e2492f27b318d732c894941deeb22b96200a1ef269385904ee25c6ec99419a473fda82b1bfbc20a22c07e4a9908151d66eb53d9afc893be366e8b3a6a36063a27763d296d37fcd30d9f15cabcf9c03a9306a69a25d71cd3fbee5b7cf1122336747aed760c89665d33f08d1f72ab812318e7a36357aae154db734b3f9470f74d57d41dbb034a7044a732a138f063f6fbaf52e61c08ae781f3a32ad4851fc41f67577a1d4d6ffb5b75b1e34863a49744f24a943826442b65950c206339d438157f7b7804e632de4b1044b399e7ce2fea1eca40970de028ef7f0a9334b828ee43e46a414b3ae30047d3a0d318cd82d0661c0be60b8e32907890edc5609175ae6452b9a2453999363ad155544a2f1dbfb24bba406f2f3cccaed8ce7ee5062849ac47ce26af5376440ae2d3de3473ee3f6ec161ab6e3ccf72fb832a76b0e2024ba0fbef8be589536ff52e3ecfc0a251fe4b52c8071f3316f30cdf10e098cb473ce9cd0c4e2f72e870a42fb39d25d6ab8076f301f8297d7d1d1b80454eee9a5f1b78d588600d883e5600b79fb9c986418cb488627355c56b804f5278bf986639cea8537ff293ef022415009ff78d3bff0dd7129884d5aaa1ffa0b118d28cd986aabba2557674d046b81559a82ce02bc80f6ca117fa20c914d7bc144bf19e3b7eb18cd2ea546c9bcd9c0c766de76d28a148008409498b3298e0ecfa3bedb0fd877e69fae6028ad1e3af05a914b1fe5fd1205eb613e499044a0330c1399a70ebb991b0ee1f4b0057e41d741ac53d89bccf7d5d9bce341b5f87edb205a06b5d282c6101667dec0ef104c5029affdc9bd4d9b3d089ef3acccde874f617bd550ecca010b1cb58f525ed5f46d7f319feb8a295cd80f9ac9eb2d58516c47c9854908441044fc3eb0a75c0637fb1199191ebfd49c637eb0e473ab0cea2508d1c77b766ca5787f9779c90e23aeafbcd367ad8ee4da85f3b745028c2e5e73919604e0509c995449f03af94892dcd9b596ce495315d5b7764cbb6c6a1634ea53d097bc89532c2efe79d94e739676b55f852f1f7d94aed5b4a22b43c4a72d3f3a825a1334e31e0d3027a228fe108604064b1b5d039c88f497018467d47aa22d0c4a5de625b6e66ee4f6243d8278b561ebcea4b3e7365d4055a46eb92296cc568c0f80ef563ba90b57405b4c416cae574087321f2a3711436b755901dca0db44397ae75fff8f39a5fb22f621d3b9662e62e85905005141fa7ee98c3b7ab2b3ffdd8e68a7ea0f4db80b0163acc0ce1ad32e43210f3da268c6a7486cdecc720a401f58be0d55c0eced32ff21c2fd644bf1d45531191f766be91dd0352ab7304ed3978a3d9ec20fd8bd82ee0e806273a5d10411c42f137fd001c4e57685bf080df4a5e160f8a031a2f481a26fbf1b07c7647a9fa2c5181d20f5d09f0c63cbc427d2d4df5b05c255c480e2fde4249b568e67b243090605c2c7ee30360d606d756c00da3517b5e1ef2f12bb73f3fdb17967fa2c304615386f267c9cdd2a2db6befb7f874cde947c26be1e01070a8b7e37da168c92e80dff45d36ca3bffcb1098eceee8b5595eef6c9867a71a5ac130ae415432d21f1dbdc029b170931dde82fa923dfd6b43e0cbc4d55310af3fda19dd4cd47b4a98f94b24fc821c21c1db940a33447433a29d0e3ae8a4ce360b9dcde2e6a09bef87529d15550ca322be53689b9bc8fc32442d89bffdacdd2a3d2a29e552a453865fc61156018808d68ebcba5b1fa4f41e020f732de8e86cbd41041941c6a126b80b87606ea16576c8a0567921a0c20ffdd2de1c542b806d54618ebb35b5f143044c740f7218874a0106320038eaf0a0f151cc5469c620067cbcecd741019e2a5f1c91bbb72a93efade024fab2203e5ab5e3c19099e0513a28f0cbc8c6c80e44eaf564919780e72b08b7de96cfc83b9ac5ab412e7321635c72c79108427fcb155f7297a167926f0f7c4e07c46277db7c56960146e42ea43463b6011838423eb413ccad95643e04248fb6c8278afde9ab5065e63eef60464312818717ec1ddbb03fc536169d6da3191dae1f125ee12997d52f30b90f7ff1669ca6f345708bce25912defe908d5bafe880b5bdda5dbd1541102a1c622e7759f3463aeaaa89f1a090016458785b55ff53c93ee1024bfd82996dd3c77d7dc5097385a7bb6a382d3758c83172c00497372e1e55a25f22d9949f266587d5c77b0c095ae9d87d4f0128b114a4d8a59280ceaa7a415e2ea7a9af69243e7df6d5e4d8801f43ef0d3cb6719ac6ff9f01f208398e5143e9b314103cf08f0a1047a3931d1a6edd28ebde2976d330dac3bdca3b1efbde3649decaedadb739364bc79db8b13569990cc58b236b6c4f11239a3c4dd2e2146f33505ab3a00cc370082ffa7ce7f30f773d61b9efec25e1dd4e94fbdbbff63519721f9cfc16b765fe4ddfc6f21939769524a789f321dd04c23a33226d04f7a16972a7c6cc1cb00bdae3ca12224a53d93b9802c18ee710872da6b75d28be8e8ee1d3002b911d65a8edda44543b83780eed6e8d9adeeedfabb83065253d1dee65335f2cde174a80fde6d9a640d88211f0a0b1afc57b5954b77ed089a39d19ddf3bf2729c7c33587c9883c586c359520b2fdc1ce2958fbc27f416d6ffbda8cc3b558e5b92e8ce8962b14d35b9e173142e25408bb8fd852165d466dba78b8b85eb31976bc9430b37ec57d16697a924cc415b3cf321d01d8f42c18de510ae69e1ec959a6db30a7ba7ca993e39aaf57d2265141181c3ba515600621217e875ed73f5454994da101ff37fc41aa71522758fafb7786cc75261d7db9823f0e19411811fdb7de2ab99d12f51b0b4e19c159bc526ff75d5265112473ab4a4f61cde68e9ff0748fdc58a32f36098a55888059a7807dffc19f5b32e1b529c32a551c9a15ec2878d217e1a83072dec6048be185f512d16dec0760681bd2ccb139d49912e39adf414ec4e4fd393aa8c36588fd3e69d1b69274ae6fff83b74394fbd5c3b539e8b9005af233226af92e81fb9db5c6b80338500870108277ee169b2ad46c6401e9438f57c7e5be372feaafed8439b988aa7a4d26e102d93bb5734f32593400866266dc24f6ae592d6851f4767aa3949077c1d30787c805d2644a79d5eb6ee361b23512d53dfbc341aa08dd5fea3730358c8759166636252394b13aede30de12816a58db4d48e43e84ed2243272731bb32ebbf5cc94fb1623749e251596c26858bb459f4c3381579c340695b418a72ef6ea7d531a7bf5a76cffde586f3eb5754782527c88f33c426842dfdc52a587a05e522fa5d24ea022b046a212db4f7544fd8872c8cfc734809f4894fbd17509d2080e2e3df01abfb1da6788aca7eeb2d69784dcf0f498a630d9673e146a52678ece665ab9b4ca62154037f96338db6c99f2b4e75b17b103630c5c3f7ac41b5bdf2d072ff3240b89dd87f8f40690a4e8fcb7af4702c5b03266344d04bd174aadb1bfeb5c30f2d676dd6e43e4e387e4708fd470c499e1c490bb53907ece92ed5f0f3c5982b9ac782dbf0070b89ace5c1d12e2803cc1ca4e59cdfd7f84e50b04d5baa85d3c8fa204120a3c71219d10e71137bb83f92571e8b35ba5b12a0340e3f6052a3b8eb54c44636ab63534fe5b60c700d8bf74d1b67d0fdcaff6ef1cebf7b38cbc5349ac32aa9e1fb0d73b1733ca73e32b0a244fb618a91672500c55248cf73de8b3274130992009a915177c048d42c4646652fbd5d398e46647da01997b08d7b555f76b203039450b8fc5b6da9dca4325da5b8773c6642822b222d0a1efcf0a02f49678ed4b30bbd6e01f3629d2fab82dc99034a5f123cfba20b35fc79fb510a32d79f072959904b05994fb9e8a27db844abfba5f90d2255e6ee1a444c76e32d5da7bf82181037afcdb3a43a0a2bb57a2270b9e6732082bb093ee191ef1e2996c3377861a195711cbb63298c229ef67b6ae4d056f952430b3f30a6456866b166c950f6ec86a93a7b492d45a544d9456c52cafed67ab92427b7d9744c223a7875bc2639653f92633dd3afcfd3f537cf00eef04d25a4d0f9a25bda65664c9f467004cf6dbdae97f2017b77e1b1914b0e089780e85bbbe218c6c92224fc82f5b0cbc71e494164789478094ec2913f131b85b67082cac42eae5cb559d4b5a8cdd4c651f751ef2054413259698afdf0c4234799aaee7dae6942d426361076894f89dd4c666c4ec159d9ede519f499d5f1862a31a145d5902c7170af1e91731cad457e605287b8e94854667122abc9e61806f4dd5278b026a397995de643b2b914b6e5493a8adfd4cb1b7eb1ded4bef085c2d312e0323842ff3bbf726cf290cc869e25d709fe9cb3e2fc21e034439d999e6f3fc6a1b9dbfcbc28515528db17d382f2e1011e528cf186bad3ce720cec27dcb2742b21acecbb7f280ecc7445b69d3aba5f56566169af3e644e3de866a9494e73f170d5c92f255aa73604bf8c2de2faad9243d5bd8d19f9ba506b0d9ec755865eef41677b3da42a2c1c23d02c3fa1231d1c446fbadbd6744c7c7316e2b1775f6c3d2a7fca39787df750dd5a8864b56716fd363a07cd4f8fb2f594fab8c1723a066bd599954ab9c0d8e9cb5ef91ee31f14da5ee7e3be229e131410f5af79be9331165d791445a501b24666a10da79a8d08f0ba4600cc0e8627ea89a71e4838e78479ecdd5aa7c6e5fb551f51335da046df961189d6aa21bdd3253b67aad26f5e0d95199ec6955f4f2c4fc09dc67944f3f26b9a37941b26ac68d445c011899c82";

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
