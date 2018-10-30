# Entrypoints

These are entrypoints for specific components to be used carefully by the consumers. If you're using one of these entrypoints we are assuming you know what you are doing. So it means that code-splitting and tree-shaking should be done on the consumer/product side.

## Creating an entrypoint

By default all the entrypoints should link `./dist/cjs` instead of `src`. This is required because we're moving the content of `./entrypoints` folder to the root of `dist` after bundle before publish.

EX:

```js
// @flow
import MyComponent from './dist/cjs/components/MyComponent';

export default MyComponent;
```

## How to use it

```js
import LayoutManagerWithViewController from '@atlaskit/navigation-next/LayoutManagerWithViewController';
```

## Exposed entrypoints

* `atlaskit/navigation-next/LayoutManagerWithViewController`
