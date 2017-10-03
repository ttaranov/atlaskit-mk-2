// @flow
import React from 'react';
import styled from 'styled-components';
import Code from './Code';
import Loading from './Loading';
import Page from './Page';
import { getData, formatName } from '../utils/examples';
import { join } from '../utils/path';

import type { Example as ExampleType } from '../types';

type ExampleProps = {
  match: {
    params: {
      example: string,
      group: string,
      name: string,
    },
  },
};

type ExampleState = {
  codeText?: string,
  CodeNode?: React.Component<any>,
};

const Body = styled.div`
  margin: 20px 0;
`;

export default class Example extends React.Component<ExampleProps, ExampleState> {
  props: ExampleProps;
  state: ExampleState = {};

  componentDidMount() {
    const { group, name, example } = this.props.match.params;

    getData(join(group, name), example).then(data => {
      this.setState({
        codeText: data.codeText,
        CodeNode: data.CodeNode,
      });
    });
  }

  render() {
    const CodeNode: any = this.state.CodeNode;
    return (
      <Page>
        <h1>{formatName(this.props.match.params.example)}</h1>
        <Body>
          {this.state.codeText ? (
            <div>
              {CodeNode && <CodeNode />}
              <Code>{this.state.codeText}</Code>
            </div>
          ) : (
            <Loading />
          )}
        </Body>
      </Page>
    );
  }
}
