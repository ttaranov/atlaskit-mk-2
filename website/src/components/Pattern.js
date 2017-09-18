// @flow

import * as React from 'react';
import styled from 'styled-components';
import Code from './Code';
import Loading from './Loading';
import Page from './Page';
import { getData, getName } from '../utils/patterns';

import type { ExampleOrPattern } from '../utils/types';

type PackageProps = {
  match: {
    params: {
      pattern: string,
    },
  },
};

const Body = styled.div`margin: 20px 0;`;

export default class Example extends React.Component<PackageProps, ExampleOrPattern> {
  props: PackageProps;
  state = {};

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props: PackageProps) {
    getData(props.match.params.pattern).then(s => this.setState(s));
  }

  render() {
    const { pattern } = this.props.match.params;
    const { codeText, CodeNode } = this.state;
    return (
      <Page>
        <h1>{getName(pattern)}</h1>
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
