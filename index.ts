import Moralis from "moralis";
var axios = require("axios");
const ethers = require("ethers");
import { EvmChain } from "@moralisweb3/common-evm-utils";
import Web3 from "web3";

let moralisOK = false;

async function getMoralis() {
  await Moralis.start({
    apiKey: "hidsb5I8O2CamlUZlHwMvyZe1Amf3U9y03C7CfmwibWjTgXfDVejNZFf3Nom4ACc",
    // ...and any other configuration
  });
  return Moralis;
}

// const moralisStart = async () => {
//   await Moralis.start({
//     apiKey: "hidsb5I8O2CamlUZlHwMvyZe1Amf3U9y03C7CfmwibWjTgXfDVejNZFf3Nom4ACc",
//     // ...and any other configuration
//   });
//   moralisOK = true;
// };

//moralisStart();

const runApp = async () => {
  if (!Moralis.Core.isStarted) getMoralis();
  const address = "0xB4b38fbB72bcB2686202a9746C19521c24f0F35d";

  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    tokenAddresses: [],
    chain: 250,
  });

  response.toJSON().map((t) => {
    console.log("Tokens:", t);
  });
};

const runApp2 = async () => {
  if (!Moralis.Core.isStarted) getMoralis();
  const address = "0xB4b38fbB72bcB2686202a9746C19521c24f0F35d";
  console.log("CHAIN", EvmChain.FANTOM)
  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain: 250,
  });

  console.log("NATIVOS:", response.raw);
};

const runApp3 = async () => {
  if (!Moralis.Core.isStarted) getMoralis();
  const address = "0x3c01F79256EDF0E643C92cb87A2F0E26B16e2067";

  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    chain: EvmChain.FANTOM,
    normalizeMetadata: true,
  });

  console.log("NFTs");

  response.result.map((nft) => {
    let data = nft.toJSON();
    console.log("NFT Name:", data.name);
    console.log("Id:", data.tokenId);
    //@ts-ignore
    console.log("URL Image:", data.metadata?.image);
  });
};

const priceGetter = async () => {
  const address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  const response = await Moralis.EvmApi.token.getTokenPrice({
    address,
    chain: EvmChain.FANTOM,
  });

  console.log(response.toJSON());
  console.log(response.toJSON().usdPrice);
  console.log(response.toJSON().nativePrice?.value);
};

const inchGetter = async () => {
  const address = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
  const amount = 1000000000000000000;

  let UsdcAddresses = "0x04068da6c83afcfa0e13ba15a6696662335d5b75";
  const res = await axios.get(
    `https://api.1inch.io/v5.0/250/quote?fromTokenAddress=${address}&toTokenAddress=${UsdcAddresses}&amount=${amount.toString()}`
  );
  console.log(res.data);
  console.log(
    "Price:",
    (res.data.toTokenAmount / res.data.fromTokenAmount) * 100
  );
};

const incheGetter2 = async () => {
  const address = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
  const amount = 8127072;
  let UsdcAddresses = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75";

  const res = axios.get(
    `https://pathfinder.1inch.io/v1.4/chain/250/router/v5/quotes?fromTokenAddress=${address}&toTokenAddress=${UsdcAddresses}&amount=${amount.toString()}`
  );

  console.log(res.data);
};

const liFi = async () => {
  const LIFI_API_URL = "https://li.quest/v1";

  const Token = "0x321162Cd933E2Be498Cd2267a90534A804051b11";
  const amount = 100000000;
  let UsdcToken = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75";

  const params = {
    fromChain: 250,
    toChain: 250,
    fromToken: UsdcToken,
    toToken: Token, // TODO: for rn we only bridge to the same token as wormhole only supports that
    fromAmount: amount.toString(),
    fromAddress: "0x5023dCB71E64F2890649A8D99E04A5C3C5e115B0",
    toAddress: "0x5023dCB71E64F2890649A8D99E04A5C3C5e115B0",
    order: "RECOMMENDED",
  };

  const quote = (await axios.get(`${LIFI_API_URL}/quote`, { params })).data;
  console.log(quote);
};

const getReceipt = async () => {
  let userOpHash =
    "0x0eb8b6596b5dd52fe4538c33026e4df3391572302c12145bad53f3a9909b4d3c";

  let API_KEY =
    "fad1aed99d279f237f8d54d70807a6d881d37ea92c6e34aad47fdd1d6ca8ea94";
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.stackup.sh/v1/useroperation/${userOpHash}`,
    headers: {
      "su-access-key": API_KEY,
    },
  };

  const res = await axios.request(config);
  console.log(res.data.data);
};
const isAvalancheAlive = async () => {
  const avaConnection = new Web3(
    "https://polished-divine-resonance.avalanche-mainnet.quiknode.pro/930f2c60323229f477c9f3e60d9f04bf1356d081/ext/bc/C/rpc"
  );

  const blockNumber = await avaConnection.eth.getBlockNumber();
  const currentBlock = (await avaConnection.eth.getBlock(blockNumber))
    .timestamp as number;
  const previousBlock = (await avaConnection.eth.getBlock(blockNumber - 1))
    .timestamp as number;
  const timeDifference = currentBlock - previousBlock;
  const threshold = 120; // average block time is 2 seconds, 2 minutes is a safe threshold
  if (timeDifference >= threshold)
    throw new Error("Avalanche is not producing new blocks at the moment");
  console.log(timeDifference);
};

const getOperation = async () => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://api.stackup.sh/v1/useroperation/0x2cb72ba7c99ee70e12ff23e834d211a24c4f85f3aae59aeb3edfec390805650f",
    headers: {
      "su-access-key":
        "7b64c3357623c83c6eed64c4bf74cd94982b66025dc594e355a9c4b35e122739",
    },
  };

  let respuesta = null;
  const tiempoInicio = Date.now();
  let res;
  while (Date.now() - tiempoInicio < 8000) {
    try {
      res = await axios.request(config);
    } catch (error) {
      // Si hay un error de red, continúa con la siguiente iteración del ciclo
      continue;
    }
    // if (res.data === undefined || res.data.error) {
    //   // Si la respuesta es nula o contiene errores, continúa con la siguiente iteración del ciclo
    //   continue;
    // }
    respuesta = res.data.data;
    if (respuesta !== null) {
      // Si se encuentra una respuesta válida, sale del ciclo
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  console.log(res)
  //if (res.data.error) console.log("No lo encontró")
  console.log("Respuesta final:", respuesta);
};


export const odosPrice = async () => {

  const data = JSON.stringify({
    chainId: 250,
    inputTokens: [
      {
        tokenAddress: "0x511D35c52a3C244E7b8bd92c0C297755FbD89212",
        amount: 10000000000000000000
      },
    ],
    outputTokens: [
      {
        tokenAddress: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
        proportion: 1,
      },
    ],
    userAddr: null,
    slippageLimitPercent: 3,
    sourceBlacklist: [],
    pathViz: true,
  });

  const res = await axios.request({
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.odos.xyz/sor/quote",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    data: data,
  });

  console.log(res.data.outAmounts[0])
};


odosPrice()
//getOperation();
//runApp();
//runApp2();
// runApp3();

//priceGetter();
