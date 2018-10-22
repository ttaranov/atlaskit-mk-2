// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  The spotlight component is used typically during onboarding to highlight elements
  of the UI to the user in a modal dialog.

  ## Example
  ${(
    <Example
      packageName="@atlaskit/onboarding"
      Component={require('../examples/10-spotlight-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/10-spotlight-basic')}
    />
  )}
  ## Modal
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Modal')}
    />
  )}
  ## Spotlight
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Spotlight')}
    />
  )}
  ## SpotlightManager
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/SpotlightManager')}
    />
  )}
  ## SpotlightTarget
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/SpotlightTarget')}
    />
  )}

`;
