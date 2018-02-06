import React from 'react';
import styled from 'styled-components';
import Loadable from 'react-loadable';
import Loading from '../Loading';
import CodeBlock from '../Code';

export default props => {
  const ExampleCode = Loadable({
    loader: () => props.example.contents(),
    loading: Loading,
    render(loaded) {
      return <CodeBlock grammar="jsx" content={loaded} />;
    },
  });
  const Example = () => (
    <iframe
      style={{
        flex: '1',
        width: '100%',
        height: '100%',
        border: 'none',
      }}
      scrolling="none"
      src={`http://localhost:9001/${props.src}`}
    />
  );

  return props.render(ExampleCode, Example, props.displayCode);
};
