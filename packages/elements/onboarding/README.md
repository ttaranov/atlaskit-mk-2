# Spotlight

The spotlight component is used typically during onboarding to highlight elements
of the UI to the user in a modal dialog.

## Example

```js
import { Spotlight, SpotlightManager, SpotlightTarget } from '@atlaskit/spotlight';

class MyClass extends Component {
  render() {
    return (
      <SpotlightManager>
        <div>
          <SpotlightTarget name="foo">
            <span>bar</span>
          </SpotlightTarget>
          <Spotlight target="foo">
            <span>baz</span>
          </Spotlight>
        </div>
      </SpotlightManager>
    );
  }
}
```

## Try it out

Interact with a [live demo of the @NAME@ component](https://aui-cdn.atlassian.com/atlaskit/stories/@NAME@/@VERSION@/).

## Installation

```sh
npm install @NAME@
```
