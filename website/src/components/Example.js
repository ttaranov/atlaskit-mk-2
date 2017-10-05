// @flow
import React from 'react';
import Loadable from 'react-loadable';
import Code from '../components/Code';
import Loading from '../components/Loading';
import type { Directory } from '../types';
import * as fs from '../utils/fs';

type Props = {
  examples: Directory,
  examplePath: string,
};

export default function Example(props: Props) {
  const found = fs.findNormalized(props.examples, props.examplePath);

  const Content = Loadable.Map({
    loader: {
      Component: () => found && found.exports(),
      code: () => found && found.contents(),
    },
    loading: Loading,
    render(loaded) {
      if (loaded.Component && loaded.code) {
        return (
          <div>
            <loaded.Component/>
            <Code>{loaded.code}</Code>
          </div>
        );
      } else {
        return <div>Failed to load code for "{props.examplePath}"</div>;
      }
    }
  });

  return <Content/>;
};
