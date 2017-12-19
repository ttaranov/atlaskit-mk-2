// @flow
import React, { type Node } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';
import { withContextFromProps } from '../src';

type Props = {
  children: Node,
};
const ContextTypes = {
  organisation: PropTypes.string,
  package: PropTypes.string,
};

const TooltipWithContext = (props: Props, context) => (
  <Tooltip description={`${context.organisation}/${context.package}`}>
    {props.children}
  </Tooltip>
);
TooltipWithContext.contextTypes = ContextTypes;

const ContextProvider = withContextFromProps(ContextTypes);

export default () => (
  <ContextProvider organisation="@atlaskit" package="layer-manager">
    <TooltipWithContext>
      <button>Package Name</button>
    </TooltipWithContext>
  </ContextProvider>
);
