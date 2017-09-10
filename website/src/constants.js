// @flow

type PyarnQueryFile = {
  filePath: string,
  fileContents: string,
}

type WebsiteData = {
  packages: Array<{
    name: string,
    docs: Array<PyarnQueryFile>,
  }>
}

export const WEBSITE_DATA: WebsiteData = (process.env.WEBSITE_DATA: any);
export const PACKAGES = WEBSITE_DATA.packages;
