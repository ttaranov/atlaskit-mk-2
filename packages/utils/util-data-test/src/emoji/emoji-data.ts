declare var require: {
  <T>(path: string): T;
};

// tslint:disable-next-line:no-var-requires
export const getStandardEmojiData = require('../json-data/service-data-standard.json');
// tslint:disable-next-line:no-var-requires
export const getAtlassianEmojiData = require('../json-data/service-data-atlassian.json');
