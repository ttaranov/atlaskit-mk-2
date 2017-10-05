// @flow
/* eslint-disable */
import React from 'react';
// import { AkCodeBlock } from '@atlaskit/code';

type ExampleProps = {
  source: string,
  language: string,
};

export default function Example(props: ExampleProps) {
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
