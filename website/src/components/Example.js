// @flow

import * as React from 'react';
import styled from 'styled-components';
import Code from './Code';
import Loading from './Loading';
import Page from './Page';
import { getExampleData, formatExampleName } from '../utils/examples';

import type { ExampleOrPattern } from '../utils/types';

type Params = {
  example: string,
  group: string,
  name: string,
};

type PackageProps = {
  match: {
    params: Params,
  },
};

const Body = styled.div`margin: 20px 0;`;

export default class Example extends React.Component<PackageProps, ExampleOrPattern> {
  props: PackageProps;
  state = {};

  componentDidMount() {
    const { group, name, example } = this.props.match.params;
    getExampleData(group, name, example).then(s => this.setState(s));
  }

  render() {
    const { example } = this.props.match.params;
    const { codeText, CodeNode } = this.state;
    return (
      <Page>
        <h1>{formatExampleName(example)}</h1>
        <Body>
          {codeText ? (
            <div>
              <CodeNode />
              <Code>{codeText}</Code>
            </div>
          ) : (
            <Loading />
          )}
        </Body>
      </Page>
    );
  }
}
