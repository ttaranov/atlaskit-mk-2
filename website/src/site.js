// @flow
import type { Directory, File } from './types';
// $FlowFixMe
import data from 'bolt-fs-loader?{ include: ["docs/**/*.md", "packages/**/docs/**/*.+(js|ts|tsx)", "packages/**/package.json", "packages/**/CHANGELOG.md", "packages/**/examples/**/*.+(js|ts|tsx)", "patterns/**/*.js"], exclude: ["**/node_modules/**", "packages/utils/docs/**"] }!';

const siteData: Directory = data;
export default siteData;
