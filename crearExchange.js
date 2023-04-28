var axios = require("axios");
const Web3 = require("web3");
const ethers = require("ethers");

var params = JSON.stringify({
  currency_from: "avaxc",
  currency_to: "matic",
  address_to: "0xfc5b53e9CC21DDD2E3573c365e97C5DcbC685238", // EN QUE ADDRESS QUERES RECIBIR EL TOKEN DE SALIDA?
  amount_from: "0.11",
});

const API_KEY = "b00b5cdf-109d-4c5b-9480-78c4db49096b";

var config = {
  method: "post",
  maxBodyLength: Infinity,
  url: `https://api.stealthex.io/api/v2/exchange?api_key=${API_KEY}`,
  headers: {
    "Content-Type": "application/json",
  },
  data: params,
};

axios(config)
  .then(function (response) {
    console.log("ID DE OPERACION (dura 20 min):", response.data.id);
    console.log("DEBE DEPOSITAR EL USUARIO:", response.data.currency_from);
    console.log("CANTIDAD:", response.data.amount_from);
    console.log("EN ADDRESS:", response.data.address_from);
    console.log("----------------------");
    console.log("Transfiriendo...");
    transferMatic(response.data.address_from, response.data.amount_from);
    ConsultarEstado(response.data.id);
  })
  .catch(function (error) {
    console.log(error);
  });

/// FUNCIONES AUXILIARES

// TRANSFERIR MATIC

// Send Matic from Matic address to Matic address
async function transferMatic(address_to, amount) {

  // ´PONER LA URL DEL RPC DE LA CADENA QUE SEA
  const polyConnection = new Web3(
    "https://polished-divine-resonance.avalanche-mainnet.quiknode.pro/930f2c60323229f477c9f3e60d9f04bf1356d081/ext/bc/C/rpc"
  );

  console.log(address_to, amount)

  const fromPrivateKey =
    ""; /// AGREGAR PRIVATE KEY DE LA WALLET QUE VA A ENVIAR LOS MATIC
  const account =
    polyConnection.eth.accounts.privateKeyToAccount(fromPrivateKey);
  const nonce = await polyConnection.eth.getTransactionCount(
    account.address,
    "latest"
  );

  const amountToSend = ethers.utils.parseEther(amount.toString());
  console.log(amountToSend)
  const gas = (40000 * Math.pow(1.14, 0)).toFixed();
  console.log("Gas", gas)

  const tx = await polyConnection.eth.accounts.signTransaction(
    {
      to: address_to,
      from: account.address,
      value: amountToSend,
      gas,
      nonce,
    },
    fromPrivateKey
  );

  console.log(tx);

  const txHash = await polyConnection.eth.sendSignedTransaction(
    tx.rawTransaction
  );
  console.log("Hash de la transacción:", txHash);
}

// CONSULTAR ESTADO DEL BRIDGE

async function ConsultarEstado(idExchange) {
  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.stealthex.io/api/v2/exchange/${idExchange}?api_key=${API_KEY}`,
    headers: {},
  };

  setTimeout(() => {
    axios(config)
      .then(function (response) {
        console.log(
          "From:",
          response.data.amount_from,
          response.data.currency_from
        );
        console.log("To:", response.data.amount_to, response.data.currency_to);
        console.log("Fecha Creacion:", response.data.timestamp);
        console.log("Estado:", response.data.status);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, 10000);
}
