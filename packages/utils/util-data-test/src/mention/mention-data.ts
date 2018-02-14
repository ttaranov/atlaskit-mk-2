declare var require: {
  <T>(path: string): T;
};

// tslint:disable-next-line:no-var-requires
const mentionData = require('../json-data/mention-data.json');

export default mentionData;
