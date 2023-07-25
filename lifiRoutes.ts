import axios from "axios";

const routesGetter = async () => {
  var data = JSON.stringify({
    fromChainId: 137,
    fromAmount: "100000000000000000",
    fromTokenAddress: "0x0000000000000000000000000000000000000000",
    toChainId: 56,
    toTokenAddress: "0x0000000000000000000000000000000000000000",
  });

  var config = {
    method: "post",
    url: "https://li.quest/v1/advanced/routes",
    headers: {
      "Content-Type": "application/json",
      Cookie: "__cflb=0H28vpfYNLnbmLmb6raYyxitg2VFPogMLDXGKoejCNQ",
    },
    data: data,
  };

  console.log("Bridge From Chain", JSON.parse(data).fromChainId);
  console.log("Bridge To Chain", JSON.parse(data).toChainId);
  console.log("From Token", JSON.parse(data).fromTokenAddress);
  console.log("To Token", JSON.parse(data).toTokenAddress);
  console.log("Amount", JSON.parse(data).fromAmount);
  console.log("");
  console.log("");
  console.log("");
  console.log("Possible Routes");

  let response = await axios(config)
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return response;
};

const checkRoutesFees = async () => {
  let RECOMMENDED: any = null;
  let FASTEST: any = null;
  let CHEAPEST: any = null;

  let rutas = await routesGetter();

  rutas.routes.map((route: any) => {
    console.log(route.steps)
    console.log(route.steps[0].action)
    route.steps.map((step: any) => {
      if (route.tags.includes("RECOMMENDED")) RECOMMENDED = step.tool
      if (route.tags.includes("CHEAPEST")) CHEAPEST = step.tool
      if (route.tags.includes("FASTEST")) FASTEST = step.tool
      // console.log("");
      // console.log("");
      // console.log("**********************************");
      // console.log("");
      // console.log("");
      // console.log("TOOL USED:", step.tool);
      // console.log("Route Tags:", route.tags);
      // console.log("Estimated Time:", step.estimate.executionDuration);
      // console.log("Gast Cost USD:", route.gasCostUSD);
      // console.log("Fees Cost of using this tool");

      step.estimate.feeCosts.forEach((feeCost: any) => {
        // console.log("---------------------");
        // console.log("Token Symbol to pay fee:", feeCost.token.symbol);
        // console.log("Token Address:", feeCost.token.address);
        // console.log("Token Amount:", feeCost.amount);
        // if ("amountUSD" in feeCost)
        //   console.log("Amount in USD:", feeCost.amountUSD);
        // console.log("IS INCLUDED", feeCost.included);
      });
    });
  });
  console.log("-----------------")
  console.log("FINAL DETAIL")
  // console.log of recomended fastest and chepaest
  console.log("Recommended Tool:", RECOMMENDED)
  console.log("Fastest Tool:", FASTEST)
  console.log("Cheapest Tool:", CHEAPEST)
};

checkRoutesFees();
