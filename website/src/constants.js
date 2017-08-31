// @flow
type WebsiteData = {
  packages: Array<{
    name: string,
    docs: Array<{}>,
  }>
}

export const WEBSITE_DATA: WebsiteData = (process.env.WEBSITE_DATA: any);
export const PACKAGES = WEBSITE_DATA.packages;
