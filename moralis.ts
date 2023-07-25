import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

async function getMoralis() {
  await Moralis.start({
    apiKey: "hidsb5I8O2CamlUZlHwMvyZe1Amf3U9y03C7CfmwibWjTgXfDVejNZFf3Nom4ACc",
    // ...and any other configuration
  });
  return Moralis;
}



const moralisGetNativeBalances = async () => {
  if (!Moralis.Core.isStarted) getMoralis();
  const address = "0xb93Bad01CE69496ACB82870e18cf706d7cc6675C";
  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain: EvmChain.BSC
  });

  console.log("Native Balance:", response.raw);
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


const moralisGetTokenBalances = async () => {
  if (!Moralis.Core.isStarted) getMoralis();
  const address = "0xF8B56939fF7246142211Ab7b136EB2Ea061046e5";

  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    tokenAddresses: [],
    chain: 250,
  });

  let TokenBalances:any = []

  response.toJSON().map((t) => {
    TokenBalances.push(t)
  });

  console.log("Balance of Tokens:", TokenBalances)
};
//moralisGetTokenBalances();

//moralisGetNFTBalances();
moralisGetNativeBalances();