// @flow
import { profilecard as profilecardUtils } from '@atlaskit/util-data-test';
import { AkProfileClient, modifyResponse } from '../../src';

const { getMockProfileClient: getMockProfileClientUtil } = profilecardUtils;
const MockProfileClient = getMockProfileClientUtil(
  AkProfileClient,
  modifyResponse,
);

export const getMockProfileClient = (cacheSize, cacheMaxAge) =>
  new MockProfileClient({
    cacheSize,
    cacheMaxAge,
  });

export default null;
