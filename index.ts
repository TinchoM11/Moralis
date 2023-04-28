import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

let moralisOK = false;

const moralisStart = async () => {
  await Moralis.start({
    apiKey: "hidsb5I8O2CamlUZlHwMvyZe1Amf3U9y03C7CfmwibWjTgXfDVejNZFf3Nom4ACc",
    // ...and any other configuration
  });
  moralisOK = true;
};

moralisStart()

const runApp = async () => {
  const address = "0x622fe23da93332716c1139106ea61002caf84526";

  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    tokenAddresses: [],
    chain: EvmChain.BSC,
  });

  response.toJSON().map((t) => {
    console.log("Tokens:", t)
  });

};

const runApp2 = async () => {
  const address = "0xAE13fCFb77eb02361C196e30105E91867AfaC369";

  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain: EvmChain.BSC,
  });

  console.log("NATIVOS:", response.raw);
};

const runApp3 = async () => {

  const address = "0x11b435e15e021fb74e52a836bdfeb360f17f803a";

  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    chain: EvmChain.BSC,
    normalizeMetadata: true,
  });

  console.log("NFTs")

  response.result.map((nft) => {
    let data = nft.toJSON()
    console.log("NFT Name:", data.name)
    console.log("Id:", data.tokenId)
    //@ts-ignore
    console.log("URL Image:", data.metadata?.image)
  });

};

runApp()
runApp2()
runApp3()
