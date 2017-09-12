// @flow
import * as React from 'react';
// import { AkCodeBlock } from '@atlaskit/code';

type ExampleProps = {
  source: string,
  language: string,
};

export default class Example extends React.PureComponent<ExampleProps> {
  props: ExampleProps;
  render() {
    const { source, language } = this.props;

    return (
      // <AkCodeBlock
      //   text={source}
      //   language={language || 'javascript'}
      // />
      <div>
        {language}:
        <textarea>{source}</textarea>
      </div>
    );
  }
}
