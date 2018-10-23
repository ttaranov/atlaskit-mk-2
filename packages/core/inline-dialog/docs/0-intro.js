// @flow
import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';

export default md`
  ### Usage

  Inline Dialog components launch a modal that is displayed outside a block of content, and over the top of surrounding elements. They can be made to change position to fit in the page.

  The content takes two different react elements:

    - The children, which are the elements the modal will be positioned relative to, using the position prop.
    - The content, which is the content to display inside the modal.

  ### Install

  ${code`
  import InlineDialog from '@atlaskit/inline-dialog';
  `}

  ### Example

  ${(
    <Example
      packageName="@atlaskit/inline-dialog"
      title="Basic Inline Dialog"
      Component={require('../examples/01-basic').default}
      source={require('!!raw-loader!../examples/01-basic')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/InlineDialog')}
    />
  )}
`;
