var axios = require("axios");
const Web3 = require("web3");
const ethers = require("ethers");

// PARAMETROS A PASARLE A LA API DE STEALTH
var params = JSON.stringify({
  currency_from: "bnb", // VER BIEN SIMBOLO DE CADA TOKEN PARA STEALTH
  currency_to: "eos",
  address_to: "iya2y4uueyxv", // EN QUE ADDRESS QUERES RECIBIR EL TOKEN DE SALIDA?
  amount_from: "2", // MONTO A BRIDGEAR
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
    console.log("Respueta total de la API:", response.data);
    console.log("Bridge Id (lasts 20 min):", response.data.id);
    console.log("User Needs to Deposit:", response.data.currency_from);
    console.log("Amount:", response.data.amount_from);
    console.log("To this Adress:", response.data.address_from);
    console.log(
      `Will receive ${response.data.amount_to} ${response.data.currency_to} to this address: ${response.data.address_to}`
    );
    console.log("----------------------");
    console.log("Transfiriendo...");
    // transferNativeToken(response.data.address_from, response.data.amount_from);
    // ConsultarEstado(response.data.id);
  })
  .catch(function (error) {
    console.log(error);
  });

// LA LLAMADA A LA API DE TE DEVUELVE:
// - ID DEL EXCHANGE (SIRVE PARA CONSULTAR EL ESTADO LUEGO)
// - ADDRESS A LA QUE TENES QUE ENVIARLE EL TOKEN (MATIC EN ESTE CASO)

// TENES QUE TRANSFERIR LUEGO ESE MONTO A LA ADDRESS INDICADA
// PODES CONSULAR EL ESTADO DEL BRIDGE CON LA FUNCION (consultarEstado pasando como input el ID del Exchange generado)
// CUANDO EL ESTADO DE ESE BRIDGE PASA A "FINISHED" la api te va a devolver el hash de la transaccion en la chain de destino

/// FUNCIONES AUXILIARES

// TRANSFERIR NATIVE TOKEN
async function transferNativeToken(address_to, amount) {
  // ´PONER LA URL DEL RPC DE LA CADENA QUE MANDES (CADENA DE ORIGEN)
  const polyConnection = new Web3(
    "https://blue-fragrant-needle.matic.quiknode.pro/398157348b1378b7e59f4ccf29e1b10706fe8d97/"
  );

  console.log(address_to, amount);

  const fromPrivateKey = ""; /// AGREGAR PRIVATE KEY DE LA WALLET QUE VA A ENVIAR LOS MATIC
  const account =
    polyConnection.eth.accounts.privateKeyToAccount(fromPrivateKey);
  const nonce = await polyConnection.eth.getTransactionCount(
    account.address,
    "latest"
  );

  const amountToSend = ethers.utils.parseEther(amount.toString());
  console.log(amountToSend);
  const gas = (21000 * Math.pow(1.14, 0)).toFixed();
  console.log("Gas", gas);

  // construye la transaccion para enviar el token nativo
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

// // CONSULTAR ESTADO DEL BRIDGE
// // SE PASA POR PARAMETRO EL EXCHANGE ID QUE TE DEVUELVE LA PRIMER API (CREATE EXCHANGE DIGAMOS)
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
