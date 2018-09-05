// @flow
import React, { type Node as ReactNode, type ComponentType } from 'react';
import { ResultContext } from '../context';

type LinkProps = {
  href: string,
  children: ReactNode,
  className: string,
  tabIndex: string | null,
};

const getLinkComponent = LinkComponent => (props: LinkProps) => {
  const { className, href, children, tabIndex } = props;
  return (
    <span
      role="link"
      onClick={() => window.open(href, '_blank')}
      tabIndex={tabIndex}
      className={className}
    >
      {LinkComponent ? <LinkComponent {...props} /> : children}
    </span>
  );
};

const withOpenInNewTab = (WrappedComponent: ComponentType<*>) =>
  class extends React.Component<{}> {
    render() {
      const props = this.props;
      return (
        <ResultContext.Consumer>
          {context => (
            <ResultContext.Provider
              value={{
                ...context,
                linkComponent: getLinkComponent(context.linkComponent),
              }}
            >
              <WrappedComponent {...props} />
            </ResultContext.Provider>
          )}
        </ResultContext.Consumer>
      );
    }
  };

export default withOpenInNewTab;
