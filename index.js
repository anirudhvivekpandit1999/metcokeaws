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
 const encrypted = "86a352b3b4a335fc9d4a82e501d659b43414ba21e62f8e23397652b45c1133d23af71ed44aa970e72d4667bcec9a380461e3ddb646ce712206602816193b5c7214b00ce82034e31a07caa407b2d55b6199d7d46c8da3dd1389e4c87f3b36b43375184ab640bf181ab9a6fed00073194c7d1c2116e59489ac316b3453e8b03159c8865d48428486c85f1abddd69cdd75764644a2b61d51d4fa5b86321015a02a34700db3047a69810cadf9ae90ec7f87824cb4bd5d990a9ebaa4c081e70a931da51a410b7a206a397b73ba1dcaae8454eb26c8daa67c82d9a347c9967f9e94097667cee07956ef0ae6200e98671b102916dd3e9a00997c40b49bf6bc4e6fbf0a75fe100e8672e7baad31bbbcffec20de0b50d73ec02b83fea55735aa92e94d2c88d3c24c8f1fd2a2459d1af39a35ab7f07ec228889f771513d52fc69ff6afd6843b73da70fe440ab1e91c9258dbc2a5cdbe85a45e2c3a35ca6f9c6658781ac919db94c6023dc10975a37c8868e31392035fbdaf1adeb6d3ae70956c8b1375c738e3f6832570a88b902e46a1c3a41dbd83fe3bd4282c99216919b5b1beb2ee001174931dd3ee807f78a1e3d27428a3714876e70c94fdb410835dd5a5952d55e90ada3ae172367a87ee5b3bf49775a907f022325e084ce1872e46fa9674d126dee1e57bfb72e07ec9539365407eb0416ade68b8fd3973f958134bae382e663c38e65963218d3b5179e1c0b6676878e422e98195c663ba415eb6516d53fcc2a7de1dfff1da3275f99b99844987d93fee3b18050f57110a92605b4da0f8d62acf3ae1a01d9078045dcc78e367b93e8c81de457ca96c35d0d281e1d5b040cfb4490f93b022a0e9eadaddeb72760e465fc701c799084ab7b53fe7101606b80d166858549541a696f790182c6a3d66f33df103217954af1d05321dddc408ebda31081057ff25a8526f63127831e7f47bf340b244573b2cc9275976713a2ae43724cad2c6a6671fce1fb61303b9cfeeaddd60ac397952d968fbe05e6d1c1bfab22a08dbecbfdc529cb7289340b2e35d626f1327cb2901837ca2c73fdcdf474265ea658f4ecae1b184f0ee3707c00902936de84475abac233fbcdf6998f24389042497278fc8f80e28bd6446ab8b8f3da73f55127a252da6fecf38f46d01865dd2dce76c0fc80b28c3ca99d2121477ed695c09bd2abccd9b75a3f0303a4e1b4757b2b4d62017248b9ddb89bd0a2a16c8aa44fb2aac19f211d84fc0ca8321d2363e567fa3aa3953ec2cdf1e2ed8cbc1af74827fd44ca7fb2866985d6b4791c4c39037b18f2a59acf55bdb40d2beb8956ddd274313d7d7411e607e7b82eba16203fad95941676028c708c55bf7a905e533aca0b006e45bb8e2acd2c5d5a491497aec446422f34505043ed7878515f08a17a69cf304908933c075a1a5ba7b5b3baa44cdfdc5c110f1a81648bcab715ecfeadd2a07efb0e24e16cbe7eb1b754ee57f66b94ea8235c99d0e064dff0a954b7aa6fb19759c47db7af870860979889b272016b286a6730596604d98e9c21bb1e8197257383cfb9906385f36bac85c153cf62aaa069149c78d9c0491293521c2ae42cc3e12997fcb65bfa778f39f928c2fdf974ad87eb123df0b886ed84c68d248ad2e2784b827521570432a5094b6c6a5350843d896a04cab372c1c4eb0100a19a16943cc2ab56ead5a832fc6b7dfa2533e674527536e8ab38a3e0130471fd57fd04966c66f1f67dcd2e97b2284e15a016f7cafaec6dd3d6fc9783f2940f191dbede87c44cc32389b0b3dfee2483fbe64e3a98e4908b12cc202653cc677a9681e194a3530b72b747c9110ae690de54b0a6c171022df1813501dd05d9307ebccd46d45a65d504c23767a390d4116d370815fa0abf29c0f09b2ceee8f54ff938ae4042844ed97863d228356b4def25f76bd96da41a1709ef9d89d35e4458c684eae854cd0e9c2d34d97fada57e0089bd468bff2d6c4be1fcb9a5a96362604ff48af4e5542543441a8a179c8ea5bb123126cfa23414eb69c610ddc34739e0ef3e1382cc226b4821cea6e4f2290db8eec7986b864d9878daa243260a6639f205758d0a3789a0f4fc6b23a0e614ec0a7531cd504f3d7e03302d803beb466d7c901fba15ccabb0dbbb4bcf555fe7c32ddc41011d451c40e36c000164d6f093722f4f1227866d61676e495c13822fbdb904320fdea1339f743c334b4ad8d9be2fa57460460cc4e3a83af43f0a8efa170d44fa0d6b6869dbb0b2f92c248a7dd3da0835011e338737a41e0655df686116c495d432b1eec047a701e11527e13b94755332a43bc12a746b8851066ad72025c8266c08aafcbab425ae27f934cc89ed4abf7993ea13d03a4d4da3afe78a81b02f4da15fb9471b2f9906874b25b683ec07f69b8591917346041cd6efec1621aca1abc959e91ae549e17838e9fd95cad11f1b94d21e46aa1d5681148b1528e24830fff78cf48a2fe68d4790ed6995b3ef3b6ffd2953e675e2946827c45b3cc4ebaf5a6974f02f4ec8751ea5b9060ae51e729d1256fccb439d4904e31a00b22756830b0755811d27828166eb4e310a3c5b5c1c3044b3585b0af425b3fb0c3819a1a29db06fda830517aa5b266a32646b6a649af7e7b237dc8d44517c1626e153ceb6238a09bf921da4994e9ddcfcab5315572765b0ef3e0c17eba0cf203f400fff43c511b387b6b5e4aa5e950bf5bc89bc5dc0a1122df3b6ba2ad0f3ac4b9ba928be350f0411178383031e494dd5e96ece555d5b56433cab4142f626ee18661fd4db994973f1b7f0e80ed816ae22d20da80ade88310ef8412dec6cee8dbb1ad3574b11960ebda148e3e2d56dd7485bbc85f306de4b828171eaddc0a0cff096aac85b115040fc65c2dbf3138aab6284a037720de5eedf493ce9f470528dd167dc1b06f2adeaf228ea175647f573f0aa3b30b7dd3e296cdf791e86e5d3e24d703aef20613213381ba306b9b29e6d1c79c0c218befd7e8a916666d799561090b88081f7c9bfd2a819b00527a3da62662907e4249946029d334c144dbd3ac607115ee7c4e3928d74eb0059ac55ed0022496b0ab8c27ab6d280af2d730034ebe81e31c93f75055f04ded368be6f6cf63a7abe6efefc0975b523f9967a5458312cec6af8d515afdf5b38fd8172d1492988d18ad8726915cc22760555538d1d0b88dc0c099bfa10f3ca24efdf2e73c948b8cd6fe80363ded99aa7a641e9244ed8513459df2d9fda2d332831e1bacac01a674aa873bcd53fc9ac3296834629b84d72098e0d9d68b0f2f4d12a84c97acbe3e9f44fb16c92d5ba537dad86f5e178345883f4431ed0598601c6b046a70b94c09c81ab1130fc28086515fd6c171b8e9e7636a6ca46cbe51524ca47f31cd923e499325bff42ff87f8c52b868245480ea965409810266d2c65d9d10889acf98780c5a7b0536f76e4a8a2e828c10060948361ae3895a0576efed7fa6f865e0c8403a25435f7466bf809b851ccb86b54adce5ee4b6efc37cd3df9a927a50d1452d5e64328c5a9fd3c7e150a831c556b3fd0f0b039dd1c76706b479e3145df6eebf4a953e2366675efbaa37fa1b01e02668d0963bb8080e23f9783fa18725462b4d956a8604aa9a2828d4c65faa863faf79888028ba6a76f50937ad8c9cc3780ad7a78cade68eab993f7b540eac7ec6d5bf22434b4d2e7e5c6a679a9903ddbc956d9a257c9af0a983a778e116835a06bec0fbeac6d516e2933f7c65ba982b5a3f6e900f7802ea70577c5be68ebe83b10feaf693d094e8a9d38ffd94fe6a177dc5a4c2449349f5c33b71d23b886d4d6d3c7210ece0434acd49db8b4c6b0e812844bd7d4a2a084bfbc52bc56a3e8cfce9f0d5990641daa80d45711bd531268ef6ca0424cb5aba06c07ca771460b2a62b0a4113b3d532576b84dd12dc898e2de4f6bf2c953ab61817bc67a6b977fe05b67280b37e761dd838eeefb4285f1b0a4bbc18b6258cedaf021a8c048ee836cfb30eab7feef9d34e4c217fdebadb7d859cb89fd71f2f5494cca7348d69ec498dd0e70e3d0869d2dda2d62a29b48eda0593c892cf57aadd0e256c3017014ae26273542b792a5b74d1d9014a1cda2cd5e307bdc641212f1b9e064bb5331f079691616ea223bf684e7c90dcd9a34a7387004ae0d4fb1d8569263f634d46233f02963498d02aec4848e1da7bf48d0130ea3e17da6464b64eac1d7e7cf0e37afff4863f7fe5312ce8ff67138dbdbe0661b73d0be2fc2001dbe24719b049ee00716da02ed7748a9b43aa96b719efede6da19f5214a97e2365cff8d5e554178eb7b1c802cfd5a117847079dbeb91f65ca33719ec90ee0578c4095341c36d47f4e8ad7be93dab7c85a8d550ab5737508b13784e27df58d57ed1e899db9a89840c054ca1b43323b46bcd28208e0b603bae874485598a7e57dbff866f886f34713bcb87e42067b7829748c30275fdb096b7197d9723080dbbdf64cab3b3935d4f466f5ca1d3d6c4fb436fdf9db5439547d97bcaf0aa974ff842ef4f41f6b05683d3c6c52152ed68e2a1cdfe0c026b2b4874b94bba86bed23b6f86de738724425bc10e2adafadfd3dd579db76ae95cb57d0821ab3077df3897d14aafdff8d669e47d6cfbb21a3cf362541636de00a91efd50ddeb60674b37af5d24e4884adad9887eaeb0527592f1a22e9f0589478e3d96656aa79588f7cfd4b60de2b098ab597621f448808344c4a2bd59a44841d041d3587806fc155275232d8f5b68c41fdeaa8e6a91f13bf50df980f1cec1496d9423a666b68e0541f38838da1e0f2bc5f5c652ec21f9ff924e71b1ded89a5a4249236a481886e9409cedb8849321aa6dfff5d453ee04c27f264cea5624702705e73727fbd4312bfd06e4838f6c46d359e1277f8d5746f24005cfbfd2589b977ab0350c11df61dff0b675984f716b6c494398d52aa49d545c1714a94b9c9c942a7ddae8358bfe3805c72ad16d8974dd1e80a38af8b0c2231c3510eeda7e31d88238e04b6d0c1a9738ed22f81480b2010455c6e6d7d7e34b12c45307f52b8a884d2bfbe2dffdd69cfa1f4efd08e6efa9ad73f3fa7acd35f14f55936fa0985a518737b6c34df237dd3bc56321f52eab391b41a36ad620bb4b17b20e1895ec0c5055eff1fa6bdfc09a6921c856e0763097ef1f208b663b10089f28143e71bcb8047e42b5eb09749dcfd4859d52c2db9dd29d238c2a1106f3e308e4426eb7780f586ba1d5e60ad0df1a6a2bb79feba11bb9e34c1a784d8804756f5b90fd883bc0d56d5b9c6d653822cef46e5001e2dfa7742c69d33301bc5f6978ee70d6a24494cc9ddeea2cc1c6b4ef8c340feafa99e0eebcda51c98012f8b13329e11af3cd64a0c77d9aba65dff9bec64f75189ef55ecb8a0802972354d38d9467cea507e19c74ab324d8a28a733eb63c9bd334b20fc4c129ada332f3eab4a4aa237ee7d6566344dbae4265d6dfb5ed513a96b80280617dc7d4f8b037886d0d749637815ac0f48569b6c11d5ebf87f202f2feecc270a2c2050fca950656e6052b61c5fbab09922d335aac1f39d9ae5a5e84ded07d8bfee4b5e8ded895e98301047ff3de1671b0d37fb659b66b4122d31712fa2c66d5ed45b56d193ef8259fc88fd79212205cf336fb12ada53093ac9c455c5490ab4717d8eb348d325b6ccf074922d8f80591a61618b952a4a75e0bb2778a7ee43dd549084bae07f45eacac461e2ca828f87835c63bf83e1ff2f080b8a8939f58e3897d095da898be6cb94aa7564ffde042f23e0d7cb2de7a0e8b8f11ee3d4adf20f0b06ea49020b401b830c8c1a7f39553b8c7ed434a01094b54efff7afa988b747c8eaa6c65a3969d922c81b2a5b0bddde013361a3eebc67f7aa2968936bd281f35d8310a8049f94a86b5507c5d516b5b9501dbe03964e50b477e2f17d23c453bb8f4ed00adc16efdcdce95702458f91df2677d8e217cabf28e03790bf3a3eeb3c1e1ad2939aea005539896aa90d74798f2ae6b6ff0ccfef3506f0d243432055ab5936110a2632792a6a99dccbe13abbdc4ec642e9f03a5ebc4fd44b78981242261b6e8352ff4be5f5b56559c85574773750f89d8d4dd744547e1d62d40f4691259379050d29cc2e372d1edbf03ea6ea3282143920fbcdef0f36966c7a5f079d110479e7836948bc378122e7c370cfcf7661c6f1c33b03e98e121e678a5d0fd53c48fb4b2df9e8e1e07652cae10357e10b19aac3a85bd5607ee07e15e5d2a9ca6574afb8074cb7637d09819daa985de37f457838b8c2002861a79b63aa902f9f4caa1f59269b937a6e5e392313e33b04f0c8af4a789abe04388e91512eda67e8a78e955658c4fd4fa7c67bf84f344a451d09d72c3719d29c023e7ca1c7539490242693cd113301cc5f0f6554f4ab0dda24486542856cf9ec1b8b6453c1ccd1bef3bc5e690558d54fe59cf86987859c4721f70d6b142bbcec9f0bc1b996457b11bf6e2b5840d33230f8b9923aa354d21ced1cebf4b57c0cd004c0b395c19de4aeda318fc8cee3a37a910f1a0fc7a6736ac5fc21555c11775339c1713dc23d38446a01d07d51e16c9092d678355c0eaaba8199f3203aa0ea5493dbb56d1c7a5e1a61d288add91238bb0a770e4a922b09eb8687220c5de631548b8b16564e9f80a9a5602533ff9b31f11ba4eee035c1cd3a91321a8ecf78cf6048f479b23d33a75ba4dc69798bec25c1e00ebad0b3c46de0f619f34f571f5bad31f06e516c7c701fad934a42dc6249504fcd79442845a900ee7518886616e1c4e8f63233202f66d6aa69975feeb78bf02dbcf4b39c598310a15b0e1e7c9eced45aeee9097ef7bbf512a1e278db6e125bd2370e9ecbd0e5c13139a4371d49aff6fb8175694bb9d8700c47f8f61464980d04b6fde8ebea204e018e489e573299054cf3d6a90b2b8215853b74d8e90ce49d84a2895cb33546502782999a29e820855a5fb4e13ec4a5388c5c6e71bd8dd865dfddc13f2abb2430be19fad27dedccf5b72b7f2d883042e4190e9132f7cfdc40a2f587547e95a8ee2c98c52bdaf28353bbf295f7d2a84ccac2ee99d540d2786001648c2eb664eebfa553bf13f773174cd6b4a6bba7d3fc36b683b66b1d1427e15cee7d9e2bcdb1437244fd1d3d80a7839f29fb5c60ade66a3c807108a2aedb72907931989be61ebdb8f4d0d087030878e06f42c334a6b63e0368d4b7815ed8980f2bdb149a31c2fb9e96619723cca6f813ba99c2d91d20c6850a946266ca22afe6ec20c4e0549f98876638d2fffdf3cf058537d6199d263fc3c82ac14f76dad5a91004beefa4342a1c06571cfa60bdc1cce5b2d280";

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
