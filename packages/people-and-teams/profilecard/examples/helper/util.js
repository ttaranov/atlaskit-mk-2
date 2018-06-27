// @flow
import { getMockProfileClient as getMockProfileClientUtil } from '../../mock-helpers';
import { AkProfileClient, modifyResponse } from '../../src';

const MockProfileClient = getMockProfileClientUtil(
  AkProfileClient,
  modifyResponse,
);

export const getMockProfileClient = (cacheSize: number, cacheMaxAge: number) =>
  new MockProfileClient({
    cacheSize,
    cacheMaxAge,
  });

export default null;
