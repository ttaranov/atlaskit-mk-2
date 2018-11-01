# Entrypoints

These are entrypoints for specific components to be used carefully by the consumers. If you're using one of these entrypoints we are assuming you know what you are doing. So it means that code-splitting and tree-shaking should be done on the consumer/product side.

## Creating an entrypoint

By default all the entrypoints should link `./dist/esm` instead of `../`. This is required because we're moving the content of `./entrypoints` folder to the root of `dist` after bundle before publish.

EX:

At `src/entrypoints/LayoutManagerWithViewController.js` we have a file with content of

```js
// @flow
import LayoutManagerWithViewController from '../components/LayoutManagerWithViewController';

export default LayoutManagerWithViewController;
```

And, in build time, the import will be changed to point to `./dist/esm`

```js
// @flow
import LayoutManagerWithViewController from './dist/esm/components/LayoutManagerWithViewController';

export default LayoutManagerWithViewController;
```

## How to use it

```js
import LayoutManagerWithViewController from '@atlaskit/navigation-next/LayoutManagerWithViewController';
```

## Exposed entrypoints

* `atlaskit/navigation-next/LayoutManagerWithViewController`
