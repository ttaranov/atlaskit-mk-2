// @flow

import React from 'react';
import { md } from '@atlaskit/docs';
import Button from '@atlaskit/button';
import { Hr } from './shared';

export default md`
## Guides and documentation

### 🗺 Composing your navigation

This guide is a great place to start if you haven't used the library before. It will introduce you to many of the components exported by \`navigation-next\`, and will walk you through composing a simple navigation.

${(
  <p>
    <Button
      appearance="primary"
      href="/packages/core/navigation-next/docs/composing-your-navigation"
    >
      Read the guide
    </Button>
  </p>
)}

${<Hr />}

### 🌏 Controlling navigation views

If you're wondering how to manage the state of your navigation, this guide is for you. It will introduce you to some of the more advanced concepts in \`navigation-next\`.

${(
  <p>
    <Button
      appearance="primary"
      href="/packages/core/navigation-next/docs/controlling-navigation-views"
    >
      Read the guide
    </Button>
  </p>
)}

${<Hr />}

### 📦 UI component documentation

Props documentation for all of the components exported by \`navigation-next\`.

${(
  <p>
    <Button
      appearance="primary"
      href="/packages/core/navigation-next/docs/ui-components"
    >
      Read the docs
    </Button>
  </p>
)}

${<Hr />}

### 🧠 State controller documentation

API reference for the UI and View state containers.

${(
  <p>
    <Button
      appearance="primary"
      href="/packages/core/navigation-next/docs/state-controllers"
    >
      Read the docs
    </Button>
  </p>
)}
`;
