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
 const encrypted = "86a352b3b4a335fc9d4a82e501d659b4fcc316f31eab92d124caa2db617bb5e2e61267d7c6f408c7d36582ab28f8a52d66c3d40393f115e5b8b87a01f73792a8da33246f4e4f7b49a802ccdfc6b8fcf63eb7292dcdba3d9959e737690a195b39572e72258a6961d278f252944af0204a4cdfafc14ce8260875f5d1859f801b9636b292bdd438e0bcebc4451eed5f5f957f4f02c46650f949b9241e40b55eb2b18f5789880953bf6eef7ad73af790c71d57d653adf24b20a4e44d8008a02cedfd9664b1d6ab414c9c9b431574f33462098fb8fcbcae619eb35ab738203d4d92d06aee61ca8c22db69bb9c195b52913a27b9298f4b7f2ed022e96b889632341acd9d83846823718ea25e4e28b695505ab83047abd4906cae9480d6dc3fc4543dbd69002b593bebad09e248952a03c7bc752887acae386966c68ceb01d372f57db63f54b44623422230f1c0ce9cb5a9bdf63f7c756f31ce0b90ed1e53cba972da9dd8b1df2816969470ebd7081737f07eb5c018337140da6fa5bcce1a487ab3d3bf690d66baef37ba41aa1ed0c844bbebd21dd4a9356baab846ef3d6cc6204897050554648afba6b7e08c6d1a4968b696fb4fc008efb449b2ee829d43f7b3feb1bce050e31fe08693142042a06755e02d4b49e3a9e4864af790230d6edc49042d6cf88e925ad5a740735291cd4913770d6843641c546bf8a68e90fa0ef868c3ee9f3e31d948e92c48c07e3e380673071f29d35efa6d95fc28b96c0ab4c493a932503b460b000b8e6d2126bc6c8c73265626fffa3173d3db9d10cf9a4111a5d1fe2fac5d6d0d702523d551564a3e0c61b84159f64ace404636598fbf1b6a07f5ac9a04abe454d6130d27576d51fb80952f597883f64c80438b994eba215cda1958d8336b471ce47251128622c469799e60a4853b1867e47f3cc1861fc45921aac8bc5ea04936a30ae49b0e64ed7d06c62b701ca9298a32062b148d8d6c1c4e9756c0c1e08d1489275fc8b58c64eaa5439f2ef4f8811b381e9c07f0e36ba8ea8a20b134d18ae373c4d6e6c352825dd23cf54b2fb47e9b935ede533be47470076a697d97fcf7c3b310ae3915a0d71aa77a44694464af314bc00c8c3ef1c9cabc8d43f321edc5a031ec8504bcbdbe73f5089c6ad7833823b928fdb07eed1b8f06ec427ea4b5ad8235ade04cdd14a3a60191405eac4f9356b9f99406965ab1c78eff3b8f715d5083474e1f15a26916a37e0940748631496615e87ffed26c39c2e60218d106a89b6a150e4d0d09d87bc7bd50ad05be10b7bcdec1a009cc1427efb15aa8b7b49e16c2cd9e578d0790b3864f3918bca018b2586a755bdfbbd904dac9d6dada7b3a8b75a5c028797dd8eb44542dedb400636d2017999ae1f13550d458dd0a196b01dcc1d4b105d4804c53b06e25470383ec85c4e61b766a25d96dad35adfaf872db90b7e96236a9b3b7b656f06b45aa6688afced30135bcc048a9467a832c405120e80a018b37f70bcb42b5602a6fadb06f769ce5d73471b9606cbc94b6012a294de7016c8da7cef400c9c4eb288a57d758dff0db1e104c6d8a39660fceef381a6072246eaa58c09512fa9c0c93519db42ad629ae1474d94b0ceb190e2c7e310a6438007bc5fe0da6de3e8d58555461e0660c2a0f78e23fd3713789bf415162cd904b9b2e7065d0cdfa9b677dcc169be09828998465019fca4933768feebe1c8b45e5110791c9163581b4d6d39a22789ed8883ed631bb6d754a30ee47970010108649c20f8d9ca0d8a39bf31a06e94f246bdb31b0cd83484735c7f67fa3b2a6d27bf3c65bd68679366ad6d910c172ade6f59ec49d05a98a7d274b98f103e722df14d92b1c234eebb53b83d8064f287a76123a67d0f9b49c46fbc475a5ed83350a5950bae0d5c44c14dbbd8f7a4e73b14b00b37983cc64067bb6cc7c05b66a5f84aae4b150d98b80818e2da21c2310918e732fa61ae25172546a09f682797e75904aa23fdd1f1ab43f0581f0ab4d7016954c8379e2e5d23771a1eab0de9f42c6250087ca8e49c4aa1c1404607a04be62e6bac55e8f2c492c6b28bc420d965f211e5deffea4fa131f8638f1a68d4514502d466c55261d468d76630c530ba96976d95852ed0ffb1e7b6867f0e6de4efc3efcf6b1aba3c8575439d7787a0919ed44775da870f1e27f4e4ff91aeee1afe7f95cffe3e5c7d91f7a5405d8eb0f48f0a190a94f49eb98f0472dae49ce4b1938ae1228fb3a7baa17136032b5855fc5dbdbd3c7db9a41dfa8b419869d0e0fa7d57c384402c829d3c2a434f49f04c416236b311da4231ee8defbc37cef52b975f71a28fda87dd3d96fe8002a8e7c95049d6a3ae3e13789bb57864d38faec9a8c6d9294af45c82c795a89867cef68e55e5cfc73289bcf4fd6a890e8dca750ef3c70d7c1cfe9a3deff6770268115605421fa3a66327f86a3966adfc9e455728225ac190770abc59f2c8085e12d66d6581476d8b03ab4a3448b84fb52021a09402aee7a453dff3c8153478c0d29fc87a1d1757c154ab6b33a673927b3cf578db09f9aad5909542de788ef18f21bd0389ef2b2aaa329f791b08aeb89b179d2d9da9b3eefb7705a58b63d7b68c83e4af1f3ee2a1aa08b864a4d4b0d6f6ec8161b29c8af98ee8ca0d29e8e9bf55c7e5ca6fe5348a0c2093907b5e42eef14bc49ba7fd2fb6d1b820ffa0e8dd6c632c67a5f13cae04a561dcc3f331e40686dc86c52a45a106d154f4300900ac1c9401d5d1c7a2fdd96edf77af521bcd5f012737b9b6e9047865f428705b8007bdd53ee7deac13cd6cc27e7ad838d7c89dfb732e8e2ec2d4bb69fad2df6818b5cd01542224a31ee8a46a8c1ded0a2be310c1b4c8d73988b76f5345db2f7987a7a4be00246caf0efd0c6e0d65d497b8284289c8cef02c24b089f53fc6c34047675821f30d2f13d0fe4f3d526498eed1e25af6412ad9562f8684637ddf9b9baf0c2edc697acb825f2ee358c4718a9431a90b88db94705d6f5acd90ad790a7b9f730ff95293b4121d419ccd6ea0794d19d72411dde080718d90ba96440aadbf34469737ce26d18f5787b78bc4657eab26d18d97199650c6c3cfbeb63638e65e90d0c2154bb4c4d63adb2ee69d289c5bdbeeda657fb32dd2e9e1d89ac9aace76bbff7300fa67f802e415859ea891ef54dc5d5f58679ff02211f343e401f51f49b42270821ca90374a32a53b37d600abba0461c1e1869464a8bc3ec50612a09bc1d14688171463ae94b3e5cbd815b99465a601ea1252ff92021fabc1eee990841a6a9bc356ae1b0be45122fe09b32ed551464c5f5bd943a01fc5d53dafda93224fb8a94e29e624b2cbc8be76ea37ecf5b66b5e4ab1d93f206e75a57bbcd412912538251c2faee31364e0210820974c447ed422f113ac9a95a752eab0ce7dca93b3b4c5e84586def47d1525038293fa0686834dc77554737ea2bd08509d835337a2dfab0cc89573670bfd944281aa331965bab8af4f24adf4bc2f968c473cecc65564fd6953e29e7914cd18a26681851288ad4680982148e6cd58a7682a330f0a62cdcac95e58ec06e60b5568358d5d2ba8763b1f337fc07447410fa055ba388fd61a701ee1fe2b2cd1b7a5a05eedb544f067161d8e61c5434f47c2dfedf61d7e13ec1f0853ee36818f7dcc7d2c533d7d378321e89e8bb9cbe69535bbc3db3ce050a84d056b1ba6a5a83aa989482727f0f46ed47cb487d35ded7333fab420c1c5929ba0e81529f13698011aba5d2971818bfd80a2d7a9a8fe1e7345ca25bc6e884816ddbbfda4b0df5ced51d02a44eb685b88ac55f6f0b2b0975d934a0d63935dbbb494824864322c50f891c73fb11b9640a88ca8973d537f7ca5ce91ba647c95e7fc9c848608953435b5ba71fcd4ba5bb033e7b3ba3a84a00006987ae199b2147ca0ddb27ba7fc494cbdbf1981e7dd9ed2dda2533bcb2b2b3ad48eb0945ac1a132f2d77bdf005d7b5d469057cbbb0113e7ac404b52ffe2ab09d04041fb0cc3b1971a427d4093e5ebca702cdfa59769eef2090165a929fe015e3a33ff37c0744a3e57ef7328cba984fd58b0604360792d1835d1485fcab4ef27af0fb92f2062da764129e8b07a31e75dc4a80777acf38087392a1efd13a9f189aea889faa8c146b8b4cd48f0b08e22e2005c7dd742bb2e8ee1c6bf883f4a164c57bf55c968cf344298353c87e780dcee2a80bc85051a6a0569b704682e30edcf7433ae4003213e59efbf668aacf150271676896b1eb967186f6ce6ed8e6abfbf402c91d1069d11163e030210a767214e2fe8212738415f9f66711c51fd140639dbaac1ad729da9fa883c23140e56e14548296596aaac7714d6204ff1c1022a6ab62de595cfb8b33eabdbcbf3500895a126ca8941e6021242a1030647177d2b50187c5887714a7bd8bbbbdf31ebc9ef7c7d7b5033fad4ecf26a39f179eeaa71c45f42320e3aa9f8976aa5f46242c1713233dc1625c880661ae9cb09ea5a6b15e61b600129413621bc7b71500f4b5874db2a5e5a4047020e16ed01c9951bf9ad23cf9da4413c232b4ac8bd30e8f26fa9537fe9d09bd6b25a709b60421ffc10fd9b25891a2c60a5b5f0262acefb9bfb61b7fea4131536f57900fe41aae17e1b268e619fe7aecf4d1445f0065c7045127af5e378cac90227f39a47268234a795de69c6ab16ab8e4d30cb2521933e663860acb3ab38bb55c572b689d92df889bca693f84e9966ddbc79b2504fffd484bf509f6891c8d93843f100ebad2545bc0a872aeb302ce9ed06f42e9388631dbf2b7bb518d9ac5511c881168b333b69175bce84413890bd174975404f63e731a2769844af1512cdca782f13028db135d5f40729ace5fc3a9f9888e05c3b7649f33ee3d3fb00f7dc431722a55f19ec0c0c598bd4facb326190f89f75fb1e192d156fefa893d4b48852d99cf9b09c9d0481610cb45a691e48d837e03fb9c5a47dc6b90dd4b9843fdedd43f2a89c687e3bf95eb2e61b22f29175636bab12d6f4144fc289f97cc4066546605822ed7391cd9a2fd137fef24f2eee31dd356ee0f947c6b732ac841f257a09e070d458c612f9723abb98342dc20797b6d18d02714eebb88dcfbdc555c9e1f050be6c5d65893050f3c3cbeae8c230a0a9a5de0a19cfc8b3186ea15dfe95b0dc68b0bc41330338cd78804894d1c7d6ab2d9f5ed6b1df46e6a81ec6767d26f277beb579ab85597ca4c09c388482e1f7da9d7357ad3301aae0af701754892e75186777e38cf06ca361d62eade3dc0d2087a35d4ad5795ea30fcf91fd1221c89feca870b6cb6c57c83c5d24a9fe86df858a4a5b4216a06c1092c4df00e37e30167e1b8d2f8824040d5ee426ebc31c5c5250249d33be9d99f9123b89387bbcdbbe1dbc62cd9b8e85dd98aaeffd982304e480387369aa79e27e9b1069a77f52f2817e5deb49a0920a23e63f4ba92811362c4027ec145923281d0833d8d935420d04e965684bb733e126ac78cfddfd2ee2032e26d6f2cadb4f133fe8346d957c81792e5c9d54073d603a5c3fc06a369acbca3daaf1782141fb39fdfc32a0b4a1d2e0d5b86b0981824ba9bc0d884fd9b94a435fe7843ec5f267c5b616a9cdb89f25c64c0de74aed84282e5984e6ef4a8e0599ac9852d527d60957ddb055b60e3111683b87d74c5f067e80e96544ea76b5ba7bf81f512c9f6df346c54a037f72af8a5de4a5cf1a5120a40f14bbd500ebff89dbe9a7ac446ee5c3f9a1d4e7b7685139de6fe354648f39e3806b8f04a2cbe00777c754478c07ca0fe2bda78f92901ce1787cac49ad26b214091072362f9813d6a0560d627c74a92c46f30849eb7cd0d3aea6f2a73d3ada2ea17310ee94749113545f8000d48bff0b24addd039369eb75a8f2884f4528eb4b528540216f87c61790d30d385aa7775bf8b1b588001a780d8381d2316137a5dc65ef4bd0fa1987c93224c891a2216ac022f6916ea9f1983e4e1b204b15ecd082cda9917f94df85a5c4a8bba89004d13f5c318277fa5fad2c8edd035ac4ca9aeb2ea1468db1a426e6a2e115b1811169c0b2e4f353d93a00c010c5eb738219d58909a899b4d4033e306a3d85ef545949b65a0dc99e4725ba36637e83a143ad94d139acbf375229fa59aff9ea2ceaf2931a471a1c87017f4d18b2212ab7818367ac4afe0a085671c0947d6837364f6e2c83a6dc42eb70fe5939b5205fb21bd50a8eeb021fb7238cd1cfe4c668f4dbeade0f9ca93fc46e3b4f18970c12dfa59edb7915e2724b3998372e7a3881856911577116ed2d5becb0d536a5eaccb2fcc6860c8fa6566d713858cfacb51fac0a2a64951c0f0cf3f189f4cb45fa7fc89d374c881a1a22dfa69211166ec1b47797ebda96c52227be0dfe17d3c1bbbdacfd27533b0a6b1e7c2c6453a372c14370b00f620c0899dfa4b45158efc059d92db9638b2114d80d31e22494d6f903c7e039754265edb027f36562e975908c997dd148a1831a82441b17a39e2ca4fc752ed0173830715acd48b2ef76fb3d6a4a74a6cdee0789e74e4976cc5f43ebc3c4a6e883fdf1cc102667ea8e4058900afad80a39dc10246dd8e23d64219bd46abd8e0aacb7a817e20cb2afb1988f978f2c6d19178c150195e6314891ef4fdf945bcac55ffacacea247e04af6ae889d176b09557769c78438c08a2d265553c6f5b41024e7c5fb1d375cd67549dbc5abec722084ae4d57152252395de01a99eb819165efe34e708544795ab5726cb439c3d665d91b50182fd18174f7591183dbfe4a276baf9840367893720f749bf5a468c18991b32e5bb588dd5e5ae86c1f4cbd5ae7d5cc64f1c755f538d958a42bf20bb5db5004c47e75091742971b72b6b1a424edec49743455a0626f2facff0c7d2304e8527e7cef331426d78577734a8460c28533db4685ebddd20a741f0f725570dcdc607c17a4b52f9b9e82d46c58b6b43bf4034feb79634a5af875fb590bbbbf0c07c935c87ff238453943437c8c0da4591d612800457a6f5fc32da1681a091a4f7b8dd13c8a7748f7c4746c484f277f7679e52651e9652e274fc93e64096ee85c980ad529760f4d37317406f165b35e38cd75f89e2aeebfb0f9143c0f96ae22435bd070b9b058d48a9bf29c43b2a2b80028013e4fa9d3329d3c7aefce6747cb274852d76682bb758cff8a4de6c314155cc4ce5861d83057e860976112c6a00ae03345e109e7b19f3af488f14831f6ce737efae1dc7d2f6550ea22926f0b6a9b1ff2089d508cba005333a3424e523562e0aefb7d6f822c8ff5f8d699d510c8693e4d1e88314424eaf9e95747987f3d2af2c8dfe690bf5607558f16b2fa6a";

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
