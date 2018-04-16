// @flow
import React from 'react';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import ButtonBase from '../src/components/Button-v2';
import AkButton from '../src/components/AtlaskitButton';
import CurrentButton from '../src';

export default () => (
  <div>
    <h2>Basic Button</h2>
    <ButtonBase onClick={() => console.log('base click')}>Click me</ButtonBase>
    <ButtonBase
      iconBefore={<AtlassianIcon />}
      onClick={() => console.log('base click')}
    >
      Click me
    </ButtonBase>
    <h2>Atlaskit Button</h2>
    <AkButton appearance="primary">Click me</AkButton>
    <AkButton
      iconBefore={<AtlassianIcon />}
      onClick={() => console.log('ak click')}
    >
      Click me
    </AkButton>
    <CurrentButton
      iconBefore={<AtlassianIcon />}
      onClick={() => console.log('ak click')}
    >
      Click me
    </CurrentButton>
  </div>
);
