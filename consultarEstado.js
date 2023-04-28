var axios = require('axios');

const API_KEY = "b00b5cdf-109d-4c5b-9480-78c4db49096b"
const idExchange = "sPudW6EgkS"

var config = {
  method: 'get',
maxBodyLength: Infinity,
  url: `https://api.stealthex.io/api/v2/exchange/${idExchange}?api_key=${API_KEY}`,
  headers: { }
};

axios(config)
.then(function (response) {
  console.log("From:", response.data.amount_from, response.data.currency_from);
  console.log("To:", response.data.amount_to, response.data.currency_to);
  console.log("Fecha Creaction:", response.data.timestamp);
  console.log("Estado:", response.data.status);
})
.catch(function (error) {
  console.log(error);
});