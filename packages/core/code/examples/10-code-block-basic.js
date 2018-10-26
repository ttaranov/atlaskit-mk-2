// @flow
import React from 'react';
import { AkCodeBlock } from '../src';

const exampleCodeBlock = `  // React Component
  function HelloMessage (props) {
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
    <div>
      <h2>Showing code without line numbers</h2>
      <AkCodeBlock
        language="java"
        text={exampleCodeBlock}
        showLineNumbers={false}
      />
      <h2>Showing code with line numbers</h2>
      <AkCodeBlock language="java" text={exampleCodeBlock} />
    </div>
  );
}
