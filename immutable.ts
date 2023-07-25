import { ImmutableXClient } from "@imtbl/imx-sdk";
import {
  ImmutableX,
  Config,
  generateStarkPrivateKey,
  createStarkSigner,
} from "@imtbl/core-sdk";
import { BigNumber } from "ethers/utils";
import { ethers, Wallet } from "ethers";
import axios from "axios";

export const apiImmutable = "https://api.x.immutable.com/v1";

export const immutableClient = async () => {
  return await ImmutableXClient.build({ publicApiUrl: apiImmutable });
};
export const imxCoreClient = new ImmutableX(Config.PRODUCTION);

async function getBalance() {
  const client = await immutableClient();
  const balance = (
    await client.listBalances({
      user: "0xF8B56939fF7246142211Ab7b136EB2Ea061046e5",
    })
  ).result;

  console.log("Result:", balance);
  const ethBalance = balance.filter((token: any) => token.symbol === "ETH")[0];

  console.log(ethBalance?.balance || "0");
}

//getBalance();

async function nftImx() {
  let tokens = [
    "0xccc8cb5229b0ac8069c51fd58367fd1e622afd97",
    "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
  ];
  const tokenBalance: { tokenAddress: string; amount: any }[] = [];
  const client = await immutableClient();

  let nfts = await (
    await client.getAssets({
      user: "0xe9f0a340fb6837f877da670659ff15eb042e0752",
    })
  ).result;

  console.log("NFTs:", nfts);
  nfts.map((nft) => {
    console.log("Imagen", nft.image_url || undefined);
    console.log("Name", nft.name || undefined);
    console.log("Address", nft.token_address || undefined);
    console.log("Token Type", "ERC721");
  });
}

export async function imxBridgePoll() {
  const txHash =
    "0xd2c73998781faff5ee274b0bee634ac9a6792637ece1e6d58adb859ddea60534";
  const options = {
    method: "GET",
    url: `https://api.x.immutable.com/v1/deposits/`,
    headers: { "Content-Type": "application/json" },
  };
  try {
    
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.log(error)
  }

}

imxBridgePoll();

//nftImx();

// export async function imxCreateWallet() {
//   const imxCoreClient = new ImmutableX(Config.PRODUCTION);

//   const starkPrivateKey = generateStarkPrivateKey();
//   const starkSigner = createStarkSigner(starkPrivateKey);
//   const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/6d3AQnuWzbFLVJSOCXh_Fd2moB7TDqJp");
//   const ethSigner = new Wallet("fed063aa289bb59e36e0a58b5ffe996809aa79c9fb6ef36c335546272abfe44e", provider);
//   imxCoreClient.registerOffchain({
//     // @ts-ignore
//     ethSigner,
//     starkSigner,
//   });

//   console.log("StarPK:", starkPrivateKey);
// }

// imxCreateWallet();
