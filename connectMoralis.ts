import Moralis from "moralis";

export const connectMoralis = async () => {
  await Moralis.start({
    apiKey: "hidsb5I8O2CamlUZlHwMvyZe1Amf3U9y03C7CfmwibWjTgXfDVejNZFf3Nom4ACc",
    // ...and any other configuration
  });
  console.log("conectado")
};

export const getTokenBalances = async (address: string, chain: any) => {
  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });

  return response.toJSON();
};
