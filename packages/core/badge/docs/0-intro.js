// @flow

import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Badges are visual indicators for numeric values such as tallies and scores.
  They're commonly used before and after the label of the thing they're
  quantifying.

  They must be used singly after a single item name, and have only numbers.

  * Use lozenges for statuses.
  * Use labels to call out tags and high-visibility attributes.
  * Use a tooltip if you want to indicate units.

  ## Installation

  \`\`\`sh
  yarn add @atlaskit/badge
  \`\`\`

  Interact with a [live demo of the @NAME@ component with code examples](https://aui-cdn.atlassian.com/atlaskit/stories/@NAME@/@VERSION@/).

  ## Usage

  The \`default\` export gives you full badge functionality and automatically formats the number you priovide it.

  \`\`\`js
  import Badge from '@atlaskit/badge';

  // Displays: 99+
  <Badge>{1000}</Badge>

  // Displays: 999+
  <Badge max={999}>{1000}</Badge>
  \`\`\`

  ### Container

  The named \`Container\` export retains the styling of a normal badge, but without formatting. This means you can compose in whatever information you need to.

  \`\`\`js
  import { Badge } from '@atlaskit/badge';

  // Displays: <em>Something</em>
  <Badge><em>Something</em></Badge>
  \`\`\`

  _Beware that putting arbitrary content inside of a badge might cause it to take on an unitended look._

  ### Format

  The \`Format\` export can be used to compose your own badge together, or if you need the badge  style formatting somewhere else.

  \`\`\`js
  import { Badge, Format } from '@atlaskit/badge';

  // Displays: <em>999+</em>
  <Badge><em><Format>{1000}</Format></em></Badge>
  \`\`\`

  ## Examples

  ${(
    <Example
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${<Props props={require('!!extract-react-types-loader!../src')} />}
`;
