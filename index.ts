import Moralis from "moralis";
var axios = require("axios");
import {
  Keypair,
  ParsedAccountData,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
const ethers = require("ethers");
import { EvmChain } from "@moralisweb3/common-evm-utils";
import Web3 from "web3";
import { BigNumber } from "ethers/utils";
import * as web3 from "@solana/web3.js";

let moralisOK = false;

async function getMoralis() {
  await Moralis.start({
    apiKey: "9z8E1rZVD4hZVt8Pa2wevcfZSQHLBy9pFya2YgiyoKmWReA1ugLGo48l8ofgIshv",
    // ...and any other configuration
  });
  return Moralis;
}

const moralisGetTokenBalances = async () => {
  if (!Moralis.Core.isStarted) getMoralis();
  const address = "0xa81D8dD4550Ee126Ab77De7845b4359AA7afae22";

  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    tokenAddresses: [],
    chain: 137,
  });

  response.toJSON().map((t) => {
    console.log("Tokens:", t);
  });
};

const moralisGetNativeBalances = async () => {
  if (!Moralis.Core.isStarted) getMoralis();
  const address = "0xa81D8dD4550Ee126Ab77De7845b4359AA7afae22";
  console.log("CHAIN", EvmChain.FANTOM);
  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain: 137,
  });

  console.log("NATIVOS:", new BigNumber(response.raw.balance));
};

const moralisGetNFTBalances = async () => {
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

const moralisGetTokenPriceAndDecimals = async () => {
  try {
    // if (!Moralis.Core.isStarted) await getMoralis();
    // const response = await Moralis.EvmApi.token.getTokenPrice({
    //   chain: EvmChain.BSC,
    //   address: "USDC",
    // });
    // //@ts-ignore
    // console.log(response.raw);

    const respuesta = await axios.get(
      "https://li.quest/v1/token?chain=137&token=USDC"
    );

    console.log(respuesta.data);
  } catch (e) {
    console.error(e);
  }
};

const GetTokenPriceMoralis = async () => {
  const address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  const response = await Moralis.EvmApi.token.getTokenPrice({
    address,
    chain: EvmChain.FANTOM,
  });

  console.log(response.toJSON());
  console.log(response.toJSON().usdPrice);
  console.log(response.toJSON().nativePrice?.value);
};

const inchPriceGetter = async () => {
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

const liFiQuote = async () => {
  const LIFI_API_URL = "https://li.quest/v1";

  const Token = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  let UsdcToken = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
  let smartWallet: boolean = true;
  const amount = "20005000000000000000";
  let params: any = {
    fromChain: 56,
    toChain: 137,
    fromToken: "USDC",
    toToken: "USDC", // TODO: for rn we only bridge to the same token as wormhole only supports that
    fromAmount: amount.toString(),
    fromAddress: "0x5023dCB71E64F2890649A8D99E04A5C3C5e115B0",
    toAddress: "0x5023dCB71E64F2890649A8D99E04A5C3C5e115B0",
    order: "RECOMMENDED",
  };

  // if (smartWallet) {
  //   params = { ...params, denyBridges: "hyphen" };
  // }
  console.log("params", params);
  const quote = (await axios.get(`${LIFI_API_URL}/quote`, { params })).data;
  console.log(quote);
};

const stackUpDataAPI = async () => {
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
      continue;
    }
    respuesta = res.data.data;
    if (respuesta !== null) {
      // Si se encuentra una respuesta válida, sale del ciclo
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  console.log(res);
  //if (res.data.error) console.log("No lo encontró")
  console.log("Respuesta final:", respuesta);
};

export const odosPriceGetter = async () => {
  const data = JSON.stringify({
    chainId: 56,
    inputTokens: [
      {
        tokenAddress: "0x55d398326f99059fF775485246999027B3197955",
        amount: 1000000000000000000,
      },
    ],
    outputTokens: [
      {
        tokenAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
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

  console.log(new BigNumber(res.data.outAmounts[0]).div(10 ** 12));
};

export async function fixUsdcDecimals() {
  let fromAmount = new BigNumber("12345678");
  let modifiedAmount = fromAmount;
  const bnbProvider = new ethers.providers.JsonRpcProvider(
    "https://purple-alpha-breeze.bsc.quiknode.pro/5b50f123e65d90f4bfdf13c96b21e59303475c3e/"
  );
  const ftmProvider = new ethers.providers.JsonRpcProvider(
    "https://special-few-sun.fantom.quiknode.pro/a914217f84b94303c335c828d8f2942f413b566a/"
  );

  const polProvider = new ethers.providers.JsonRpcProvider(
    "https://blue-fragrant-needle.matic.quiknode.pro/398157348b1378b7e59f4ccf29e1b10706fe8d97/"
  );

  const ethProvider = new ethers.providers.WebSocketProvider(
    "https://eth-mainnet.g.alchemy.com/v2/6d3AQnuWzbFLVJSOCXh_Fd2moB7TDqJp"
  );

  const UsdcAddresses = {
    POLYGON: "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec",
    ETHEREUM: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    OPTIMISM: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    GNOSIS: "",
    AVALANCHE: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    SOLANA: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    IMMUTABLE: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    BINANCE: "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D",
    ARBITRUM: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    FANTOM: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
  };

  const FromErc20 = new ethers.Contract(
    UsdcAddresses.ETHEREUM, // SET MANUALLY FOR TESTING
    ERC20_ABI,
    ethProvider
  );

  console.log("FROM ERC20", FromErc20.address);

  let fromTokenDecimals = await FromErc20.decimals();
  console.log("DECIMALES", fromTokenDecimals);

  // const ToErc20 = new ethers.Contract(
  //   UsdcAddresses.BINANCE, // SET MANUALLY FOR TESTING
  //   ERC20_ABI,
  //   bnbProvider
  // );

  // let fromTokenDecimals = await FromErc20.decimals();
  // let toTokenDecimals = await ToErc20.decimals();

  // // Console.log Both Decimals with titles:
  // console.log("From Token Decimals: ", fromTokenDecimals);
  // console.log("To Token Decimals: ", toTokenDecimals);

  // // Si tienen distinta cantidad de decimales, redondear el de menor cantidad de decimales hasta equiparar decimales
  // if (fromTokenDecimals > toTokenDecimals) {
  //   modifiedAmount = fromAmount.div(
  //     10 ** (fromTokenDecimals - toTokenDecimals)
  //   );
  // } else if (fromTokenDecimals < toTokenDecimals) {
  //   modifiedAmount = fromAmount.mul(
  //     10 ** (toTokenDecimals - fromTokenDecimals)
  //   );
  // }

  //console.log("From Aomunt inicial: ", fromAmount.toString());

  // if (fromTokenDecimals > 6) {
  //   modifiedAmount = fromAmount.mul(10 ** (fromTokenDecimals - 6));
  // } else if (fromTokenDecimals < 6) {
  //   modifiedAmount = fromAmount.div(10 ** (6 - fromTokenDecimals));
  // }
  // console.log("From TOken Decimals: ", fromTokenDecimals);
  // console.log("Modified Amount: ", modifiedAmount.toString());
  // return modifiedAmount;
}

async function lifiDecimals() {
  let params: any = {
    chain: 56,
    token: "USDC",
  };

  const FromDecimals = (
    await axios.get(`https://li.quest/v1/token?`, { params })
  ).data.decimals;

  params = {
    chain: 137,
    token: "USDC",
  };

  const ToDecimals = (await axios.get(`https://li.quest/v1/token?`, { params }))
    .data.decimals;

  console.log("Decimales de ambas chains: ", FromDecimals, ToDecimals);
}

export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function allowance(address owner, address spender) view returns (uint256)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function increaseAllowance(address spender, uint addedValue) returns (bool)",
  "function decreaseAllowance(address spender, uint addedValue) returns (bool)",
  "function approve(address spender, uint addedValue) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

async function callExitEndpoint() {
  try {
    const endpoint =
      "https://hyphen-v2-api.biconomy.io/api/v1/insta-exit/execute";
    const requestBody = {
      fromChainId: 137,
      depositHash:
        "0xbdb56d77547c191d1742d8a29b0a7f63d1358d36dc37354eaf36b05c4c787913",
    };

    const response = await axios.post(endpoint, requestBody);
    console.log(response.data); // Aquí puedes manejar la respuesta según tus necesidades
  } catch (error) {
    console.error("Error al llamar al endpoint:", error);
  }
}

async function getSolanaDecimals() {
  const solConnection = new web3.Connection(
    "https://solana-devnet.g.alchemy.com/v2/dnK7FnTKaxdHUq4hD308RIHfraZ3xsZT"
  );
  const info = await solConnection.getParsedAccountInfo(
    new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  );

  let decimals = info.value?.data as ParsedAccountData;
  console.log(decimals);
}

async function depositInfo() {
  const options = {
    method: "GET",
    url: "https://api.x.immutable.com/v1/deposits/224885343",
    headers: { "Content-Type": "application/json" },
  };

  axios
    .request(options)
    .then(function (response: any) {
      let status = response.data.status;
      console.log("Status:", status);
    })
    .catch(function (error: any) {
      console.error(error);
    });
}

async function imxTransferInfo() {
  const options = {
    method: "GET",
    url: "https://api.x.immutable.com/v1/transfers/224886184",
    headers: { "Content-Type": "application/json" },
  };

  axios
    .request(options)
    .then(function (response:any) {
      console.log(response.data);
    })
    .catch(function (error:any) {
      console.error(error);
    });
}

import { ImmutableXClient } from "@imtbl/imx-sdk";
import { ImmutableX, Config } from "@imtbl/core-sdk";

export const apiImmutable = "https://api.x.immutable.com/v1";

export const immutableClient = async () => {
  return await ImmutableXClient.build({ publicApiUrl: apiImmutable });
};
export const imxCoreClient = new ImmutableX(Config.PRODUCTION);


export const isRegisteredOnImx = async (address: string) => {
  // Check if user is registered on IMMX
  try {
    const isRegisteredonImx = await imxCoreClient.getUser(address);
    console.log("true")
    return true;
  }
  catch (e) {
    console.log("false")
    return false;
  }
}


// call all functions on this file one by one
isRegisteredOnImx("0x16fBF98a7dDc3957168Ae4670d63582DEF3D67C7");
// getOperation();
// stackUpDataAPI();
// isAvalancheAlive();
// stackUpDataAPI();
//liFiQuote();
//fixUsdcDecimals();
//lifiDecimals();
// moralisGetNFTBalances();
//moralisGetNativeBalances();
//moralisGetTokenBalances()
//getSolanaDecimals();
//GetTokenPriceMoralis();
//callExitEndpoint()
