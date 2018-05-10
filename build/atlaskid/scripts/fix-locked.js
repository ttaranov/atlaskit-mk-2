const axios = require('axios');

const config = require('../config');

const baseUrl = config.baseUrl;

(async () => {
  console.log('Unlocking...');
  const response = await axios.post(`${baseUrl}/api/unlock`);
  if (!response || !response.data || response.data.locked !== false) {
    console.log(
      'Something may have gone wrong... Try doing this manually instead.',
    );
    process.exit(1);
  }
  console.log('Success!');

  console.log('Calling next()...');
  const response2 = await axios.post(`${baseUrl}/api/next`);
  console.log('Success!');

  console.log('Checking current state...');
  const { data } = await axios.get(`${baseUrl}/api/current-state`);
  console.log(JSON.stringify(data, null, 2));
})();
