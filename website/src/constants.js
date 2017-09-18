// @flow

type PyarnQueryFile = {
  filePath: string,
  fileContents: string,
}

type WebsiteData = {
  [string]: Array<{
    name: string,
    description: string,
    version: string,
    relativePath: string,
    docs: Array<PyarnQueryFile>,
  }>
}

export const WEBSITE_DATA: WebsiteData = (process.env.WEBSITE_DATA: any);
export const PACKAGES = WEBSITE_DATA.packages;
