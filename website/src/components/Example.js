// @flow

import * as React from 'react';
import styled from 'styled-components';
import Page from './Page';
import FourOhFour from './FourOhFour';
import { getExample, formatExampleName } from '../utils/examples';

type PackageProps = {
  match: {
    params: {
      component: string,
      example: string,
    },
  },
};

type PackageState = {
  children?: React.Node,
};

const Body = styled.div`margin-top: 20px;`;

export default class Example extends React.PureComponent<PackageProps, PackageState> {
  state = { children: null };
  props: PackageProps;

  componentDidMount() {
    const { component, example } = this.props.match.params;
    this.setState({
      children: new (getExample(component, example) || FourOhFour)(),
    });
  }

  render() {
    const { example } = this.props.match.params;
    const { children } = this.state;
    return (
      <Page>
        <h1>{formatExampleName(example)}</h1>
        <Body>{children || <div>Loading...</div>}</Body>
      </Page>
    );
  }
}
