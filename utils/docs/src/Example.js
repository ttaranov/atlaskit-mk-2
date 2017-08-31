// @flow
import * as React from 'react';

type ExampleProps = {
  source: string
};

export default class Example extends React.PureComponent<ExampleProps> {
  props: ExampleProps;
  render() {
    const { source } = this.props;

    return (
      <pre><code>{source}</code></pre>
    );
  }
}
