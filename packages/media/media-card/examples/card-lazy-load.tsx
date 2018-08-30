import * as React from 'react';
import * as scrollParent from 'scrollparent';
import styled from 'styled-components';
import {
  createStorybookContext,
  genericFileId,
} from '@atlaskit/media-test-helpers';
import { IntlProvider } from 'react-intl';
import { Card } from '../src';

const GradientBackground: React.ComponentClass<
  React.HTMLAttributes<{}>
> = styled.div`
  background: linear-gradient(
    to bottom,
    rgba(226, 226, 226, 1) 0%,
    rgba(254, 254, 254, 1) 100%
  );
`;

const DummyContent: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  height: 125vh;
`;

const context = createStorybookContext();

class Example extends React.Component<{}, {}> {
  handleMount = el => {
    if (el) {
      const parent = scrollParent(el);
      parent.scrollTo(0, 9999);
    }
  };

  render() {
    return (
      <IntlProvider>
        <div ref={this.handleMount}>
          <GradientBackground>
            <DummyContent />
            <Card context={context} identifier={genericFileId} />
            <DummyContent />
          </GradientBackground>
        </div>
      </IntlProvider>
    );
  }
}

export default () => <Example />;
