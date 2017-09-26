// @flow

type BoltQueryFile = {
  filePath: string,
  fileContents: string,
};

type WebsiteData = {
  [string]: Array<{
    name: string,
    description: string,
    version: string,
    relativePath: string,
    docs: Array<BoltQueryFile>,
  }>,
};

export const WEBSITE_DATA: WebsiteData = (process.env.WEBSITE_DATA: any);
export const PACKAGES = WEBSITE_DATA.packages;

// $FlowFixMe
export { default as EXAMPLES } from 'bolt-query-loader?{workspaceFiles:{examples:"examples/*.js"}}!';
