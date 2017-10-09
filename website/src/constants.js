// @flow

import type { Packages } from './types';

type WebsiteData = {
  packages: Packages
};

export const WEBSITE_DATA: WebsiteData = (process.env.WEBSITE_DATA: any);
export const PACKAGES = WEBSITE_DATA.packages;

// $FlowFixMe
export { default as EXAMPLES } from 'bolt-query-loader?{workspaceFiles:{examples:"examples/*.js"}}!';

// $FlowFixMe
export { default as DOCS } from 'bolt-query-loader?{projectFiles:{docs:"docs/**/*.md"}}!';
