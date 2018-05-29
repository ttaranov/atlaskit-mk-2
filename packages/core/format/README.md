# Format

A collection of various formatting components.

## Included formatters

- Max

### Max

```js
import { Max } from '@atlaskit/format';

// Outputs: 10000
<Max>{10000}</Max>

// Outputs: 100+
<Max max={100}>{10000}</Max>

// Outputs: ∞
<Max>{Infinity}</Max>

// Outputs: ∞
<Max max={100}>{Infinity}</Max>
```

## Try it out

Interact with a [live demo of the @NAME@ component with code examples](https://aui-cdn.atlassian.com/atlaskit/stories/@NAME@/@VERSION@/).
