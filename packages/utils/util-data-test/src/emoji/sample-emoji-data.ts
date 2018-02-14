declare var require: {
  <T>(path: string): T;
};

// tslint:disable-next-line:no-var-requires
export const standardServiceEmojis = require('../json-data/test-emoji-standard.json');
// tslint:disable-next-line:no-var-requires
export const atlassianServiceEmojis = require('../json-data/test-emoji-atlassian.json');
