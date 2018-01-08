// @flow
import React, { type ComponentType, type Node } from 'react';
import withContextFromProps from './withContextFromProps';

type ContextTypes = {
  [contextName: string]: any,
};
type Props = { children: Node };

/**
 * Maintains context props across portal boundaries.
 *
 * @param WrappedComponent The portal boundary component to wrap
 * @param contextTypes The context proptypes that should be maintained.
 */
const withContextAcrossPortal = (
  WrappedComponent: ComponentType<*>,
  contextTypes: ContextTypes,
) => {
  const ContextProvider = withContextFromProps(contextTypes);

  const withContextComp = ({ children, ...props }: Props, context: any) => (
    <WrappedComponent {...props}>
      <ContextProvider {...context}>{children}</ContextProvider>
    </WrappedComponent>
  );

  withContextComp.displayName = 'withContextAcrossPortal';
  withContextComp.contextTypes = contextTypes;

  return withContextComp;
};

export default withContextAcrossPortal;
