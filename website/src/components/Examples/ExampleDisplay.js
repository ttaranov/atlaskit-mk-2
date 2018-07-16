// @flow
import React, { type ComponentType } from 'react';
import Loadable from 'react-loadable';
import Loading from '../Loading';
import CodeBlock from '../Code';

type Props = {
  src: string | null,
  name: string,
  src: string,
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
      return <CodeBlock grammar="jsx" content={loaded} name={props.name} />;
    },
  });
  if (!props.src) {
    console.error('No source url provided for the examples iframe', props.src);
    return;
  }
  const Example = () => (
    <iframe
      title="example"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
      }}
      src={props.src}
    />
  );

  return props.children(ExampleCode, Example, props.displayCode);
};
