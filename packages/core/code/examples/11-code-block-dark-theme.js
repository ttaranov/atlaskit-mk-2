// @flow
import React from 'react';
import { AkCodeBlock } from '../src';
import { AtlasKitThemeProvider } from '@atlaskit/theme';

const exampleCodeBlock = `
  class HelloMessage extends React.Component {
    render() {
      return (
        <div>
          Hello {this.props.name}
        </div>
      );
    }
  }

  ReactDOM.render(
    <HelloMessage name="Taylor" />,
    mountNode
  );
`;

export default function Component() {
  return (
    <AtlasKitThemeProvider mode="dark">
      <AkCodeBlock language="java" text={exampleCodeBlock} />
    </AtlasKitThemeProvider>
  );
}
