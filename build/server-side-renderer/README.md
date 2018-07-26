# Server side renderer

This package allows you to test the rendering of your component on a server side.

## Installation

```sh
yarn add @atlaskit/test-ssr
```

## Usage

In your `__test__/unit` folder, add a SSR test.

This test will start with:
```
/**
 * @jest-environment node
 */
```
at the top of the file to run against node. Then, you need to decide if you want to test against one or all examples.

If you test only one example:
```
import { testSSR } from '@atlaskit/test-ssr';
import Example from 'pathToExample';

testSSR(exampleName, Example);
```
If you test all examples from a package:
```
import { testSSRAll } from '@atlaskit/test-ssr';

testSSRAll(pkgName);
```
