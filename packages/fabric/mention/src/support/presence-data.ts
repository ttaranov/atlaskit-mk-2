declare var require: {
  <T>(path: string): T;
};

// tslint:disable-next-line:no-var-requires
export const validPresenceData: Response = require('./presence-valid-info.json') as Response;

// tslint:disable-next-line:no-var-requires
export const invalidPresenceData: Response = require('./presence-invalid-info.json') as Response;
