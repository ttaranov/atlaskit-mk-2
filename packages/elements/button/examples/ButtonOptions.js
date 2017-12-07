import React from 'react';
import Btn from '@atlaskit/button';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';

const Icon = <AtlassianIcon label="Test icon" />;

const Button = ({ inline = true, ...props }) => (
  <div style={{ display: inline ? 'inline-block' : 'block', padding: 4 }}>
    <Btn {...props} />
  </div>
);

const ButtonOptions = () => (
  <div>
    <Button iconBefore={Icon}>Icon Before</Button>
    <Button iconAfter={Icon}>Icon After</Button>
    <Button inline={false} shouldFitContainer>
      Fit Container
    </Button>
  </div>
);

export default ButtonOptions;
