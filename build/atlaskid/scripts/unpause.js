const axios = require('axios');

const config = require('../config');

const baseUrl = config.baseUrl;

(async () => {
  const response = await axios.post(`${baseUrl}/api/unpause`);
  if (response && response.data && response.data.paused === false) {
    console.log('Successfully unpaused');
  } else {
    console.log(
      'Something may have gone wrong... Try doing this manually instead.',
    );
  }
})();
