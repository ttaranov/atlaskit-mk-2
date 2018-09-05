// @flow
import React from 'react';
import { ResultContext } from '../context';

type LinkProps = {
  href: string,
  children: React.ReactNode,
  className: string,
};

const getLinkComponent = LinkComponent => (props: LinkProps) => {
  const { className, href, children } = props;
  return (
    <span onClick={() => window.open(href, '_blank')} className={className}>
      {LinkComponent ? <LinkComponent {...props} /> : children}
    </span>
  );
};

const withOpenInNewTab = WrappedComponent =>
  class extends React.Component {
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
