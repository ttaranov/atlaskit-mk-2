// @flow
import React, { type ComponentType } from 'react';
import { md } from '@atlaskit/docs';
// import { colors } from '@atlaskit/theme';

import Flat from '../examples/single-component-flat';

const Example = ({ component: Tag }: { component: ComponentType<*> }) => (
  <div style={{ marginTop: '0.9em' }}>
    <Tag />
  </div>
);

export default md`
  ### Flat tables
  You can use the component to display flat tables:
  
  ${<Example component={Flat} />}

`;
