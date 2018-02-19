// @flow
import React, { type ComponentType } from 'react';
import styled from 'styled-components';
import Loadable from 'react-loadable';
import Loading from '../Loading';
import CodeBlock from '../Code';

type Props = {
  src: string | null,
  example: {
    contents: Function,
    exports: Function,
  },
  displayCode: boolean,
  render: (ComponentType<any>, ComponentType<any>, boolean) => any,
};

export default (props: Props) => {
  const ExampleCode = Loadable({
    loader: () => props.example.contents(),
    loading: Loading,
    render(loaded) {
      return <CodeBlock grammar="jsx" content={loaded} />;
    },
  });
  if (!props.src) {
    console.error('No source url provided for the examples iframe', props.src);
    return;
  }
  const Example = () => (
    <iframe
      style={{
        flex: '1',
        width: '100%',
        height: '100%',
        border: 'none',
      }}
      scrolling="none"
      src={props.src}
    />
  );

  return props.render(ExampleCode, Example, props.displayCode);
};
