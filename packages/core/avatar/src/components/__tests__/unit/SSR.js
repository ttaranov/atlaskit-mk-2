/**
 * @jest-environment node
 */
// @flow
import { testSSR, testSSRAll } from '@atlaskit/test-ssr';
import Example from '../../../../examples/01-basicAvatar';

testSSR('basicAvatar', Example);
testSSRAll('avatar');
