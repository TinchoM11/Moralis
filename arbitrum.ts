import { Alchemy, BigNumber, Network } from "alchemy-sdk";
import Web3 from "web3";
var axios = require('axios');


export const ARB_RPC =
  "https://arb-mainnet.g.alchemy.com/v2/MNNPC9Y715l6bgzPBjThHypHiLOvINrJ";
export const ARB_RPC_NETWORK = "arb-mainnet";

export const arbConnection = new Web3(ARB_RPC);

export const alchemyArbConnection = new Alchemy({
  apiKey: process.env.ALCHEMY_ARB_API_KEY as string,
  network: ARB_RPC_NETWORK as Network,
});

async function nativeBalance() {
  const address = "0xa81D8dD4550Ee126Ab77De7845b4359AA7afae22";
  let balance = await alchemyArbConnection.core.getBalance(address, "latest");
  console.log(balance);
}

// same but for tokens
async function tokens() {
  let tokens: string[] = ["0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"];
  const address = "0xa81D8dD4550Ee126Ab77De7845b4359AA7afae22";
  let tokenBalances = await alchemyArbConnection.core.getTokenBalances(
    address,
    tokens
  );

  console.log("Token Balances", tokenBalances);
}

export const odosGetArbTokenPrice = async (
    amountBigNumber: BigNumber,
    fromTokenAddress = "0x0000000000000000000000000000000000000000"
  ) => {
    if (amountBigNumber.eq(0)) return BigNumber.from("0");
    if (fromTokenAddress.toLowerCase() === "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8".toLowerCase())
      console.log(amountBigNumber);
      if (fromTokenAddress === "ARBITRUM")
      fromTokenAddress = "0x0000000000000000000000000000000000000000";

    const data = JSON.stringify({
      chainId: 42161,
      inputTokens: [
        {
          tokenAddress: fromTokenAddress,
          amount: amountBigNumber.toString(),
        },
      ],
      outputTokens: [
        {
          tokenAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
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
  
    console.log(BigNumber.from(res.data.outAmounts[0]))
  };


odosGetArbTokenPrice(BigNumber.from("1000000"), "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8")
