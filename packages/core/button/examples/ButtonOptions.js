// @flow
import React from 'react';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import Btn from '../src';
import type { ButtonProps } from '../src/types';

const Icon = <AtlassianIcon label="Test icon" />;

const Button = ({
  inline = true,
  ...props
}: { inline?: boolean } & ButtonProps) => (
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
