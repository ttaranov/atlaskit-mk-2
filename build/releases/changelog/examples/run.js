const { updateChangeLog } = require('../index');
const example1 = require('./example1');

updateChangeLog(example1, { prefix: 'example1-' });

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
