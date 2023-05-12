var axios = require('axios');

const API_KEY = "b00b5cdf-109d-4c5b-9480-78c4db49096b"

let currency = "usdt"

var config = {
  method: 'get',
maxBodyLength: Infinity,
  url: `https://api.stealthex.io/api/v2/currency/${currency}?api_key=${API_KEY	}`,
  headers: { }
};

axios(config)
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.log(error);
});

