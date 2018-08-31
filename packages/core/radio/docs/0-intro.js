// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="warning">
    <p>
      <strong>Note: @atlaskit/form is currently a developer preview.</strong>
    </p>
    <p>
      Please experiment with and test this package but be aware that the API may
      & probably will change with future releases.
    </p>
  </SectionMessage>
)}
  ### Usage

  Provides a standard way to select a single option from a list.

  ${code`
  import { RadioGroup, Radio } from '@atlaskit/radio';
  `}

  @atlaskit/radio exports a controllable RadioGroup component. This
  handles the selection of items for you.

  It accepts a list of options that pass the properties on to a
  Radio component to render. 

  ${(
    <Example
      Component={require('../examples/00-basic-usage').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/01-controlled-example').default}
      title="Stateless Checkbox"
      source={require('!!raw-loader!../examples/01-controlled-example')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/02-form-example').default}
      title="With a Form"
      source={require('!!raw-loader!../examples/02-form-example')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/RadioGroup')}
      heading="RadioGroup Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/Radio')}
      heading="Radio Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/RadioInput')}
      heading="RadioInput Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/RadioIcon')}
      heading="RadioIcon Props"
    />
  )}
`;
