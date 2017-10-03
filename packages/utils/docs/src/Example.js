// @flow
import React from 'react';
// import { AkCodeBlock } from '@atlaskit/code';

type ExampleProps = {
  source: string,
  language: string,
};

export default class Example extends React.Component<ExampleProps> {
  props: ExampleProps;
  render() {
    const { source, language } = this.props;

    return (
      // <AkCodeBlock
      //   text={source}
      //   language={language || 'javascript'}
      // />
      <div>
        {language ? `${language}:` : null }
        <pre style={{ width: '100%', overflowX: 'scroll' }}>{source}</pre>
      </div>
    );
  }
}
