const axios = require('axios');
/**
 * NOTE: This utility will manage the browserstack build queues.
 * For the moment it will fail the build and display a message if more than X builds are already running.
 * The goal is to prevent Browserstack to be hammered and reduce the bumber of timeout for users.
 * */
// `${ process.env.USERNAME}:${process.env.BROWSERSTACK_KEY}` https://api.browserstack.com/automate/builds.json\?status\=running,

(async () => {
  const response = axios
    .get('https://api.browserstack.com/automate/builds.json?status=running', {
      headers: {
        Authorization:
          'Basic ZGVzaWducGxhdGZvcm10ZTE6dEVja3ljeUZMTUx2d1lmTVhhZkM=',
      },
    })
    .then(response => {
      if (response.data.length > 3) {
        console.error(
          'Browserstack is currently running with 3 builds concurrently, please try again later',
        );
        process.exit(1);
      } else {
        console.log('Your build will start soon...');
      }
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
})();
