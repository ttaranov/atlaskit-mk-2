/**
@jestEnvironment node
*/
// @flow
import { testSSR, testSSRAll } from '@atlaskit/test-ssr';
import Example from '../../../../examples/01-basicAvatar';
// @FlowFixMe
// testSSR('basic-example', Example)

testSSRAll('button');
