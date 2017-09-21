// @flow

import * as React from 'react';
import styled from 'styled-components';
import Code from './Code';
import Loading from './Loading';
import Page from './Page';
import { getData, formatName } from '../utils/examples';
import { join } from '../utils/path';

import type { Example as ExampleType } from '../types';

type PackageProps = {
  match: {
    params: {
      example: string,
      group: string,
      name: string,
    },
  },
};

const Body = styled.div`margin: 20px 0;`;

export default class Example extends React.Component<PackageProps, ExampleType> {
  props: PackageProps;
  state = {};

  componentDidMount() {
    const { group, name, example } = this.props.match.params;
    getData(join(group, name), example).then(s => this.setState(s));
  }

  render() {
    const { example } = this.props.match.params;
    const { codeText, CodeNode } = this.state;
    return (
      <Page>
        <h1>{formatName(example)}</h1>
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
