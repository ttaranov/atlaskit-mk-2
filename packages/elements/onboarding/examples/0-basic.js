// @flow
import React from 'react';
import styled from 'styled-components';
import LayerManager from '@atlaskit/layer-manager';
import { SpotlightManager } from '../src';

import SpotlightBackground from './spotlight/target-background';
import SpotlightBasic from './spotlight/basic';
import SpotlightLayout from './spotlight/layout';
import SpotlightPlacement from './spotlight/dialog-placement';
import SpotlightRadius from './spotlight/target-radius';
import SpotlightReplacement from './spotlight/target-replacement';
import SpotlightScroll from './spotlight/autoscroll';
import SpotlightWidth from './spotlight/dialog-width';

const Wrapper = styled.div`
  box-sizing: border-box;
  height: 100vh;
  margin: 0 auto;
  padding: 20px;
  width: 600px;
`;

export default function Example() {
  return (
    <LayerManager>
      <SpotlightManager component={Wrapper}>
        <p>Basic Usage</p>
        <SpotlightBasic />

        <p>Dialog Placement</p>
        <SpotlightPlacement />

        <p>Dialog Width</p>
        <SpotlightWidth />

        <p>Target Radius</p>
        <SpotlightRadius />

        <p>Target Background</p>
        <SpotlightReplacement />

        <p>Target Replacement</p>
        <SpotlightBackground />

        <p>Auto Scroll</p>
        <SpotlightScroll />

        <p>Layout Props</p>
        <SpotlightLayout />
      </SpotlightManager>
    </LayerManager>
  );
}
