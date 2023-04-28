var axios = require('axios');

const API_KEY = "b00b5cdf-109d-4c5b-9480-78c4db49096b"

var config = {
  method: 'get',
maxBodyLength: Infinity,
  url: `https://api.stealthex.io/api/v2/currency?api_key=${API_KEY}`,
  headers: { }
};

axios(config)
.then(function (response) {
  response.data.map((t) =>
    t.network.includes("AVAX-C") && console.log(t))})
  

.catch(function (error) {
  console.log(error);
});
