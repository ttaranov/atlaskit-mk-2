declare var require: {
  <T>(path: string): T;
};

// tslint:disable-next-line:no-var-requires
export const getServiceDecisionsResponse = require('../json-data/sample-decisions.json');
// tslint:disable-next-line:no-var-requires
export const getServiceTasksResponse = require('../json-data/sample-tasks.json');
// tslint:disable-next-line:no-var-requires
export const getServiceItemsResponse = require('../json-data/sample-elements.json');
