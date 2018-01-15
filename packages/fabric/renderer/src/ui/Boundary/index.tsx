import * as React from 'react';
import { PureComponent } from 'react';

import { UnsupportedBlock } from '@atlaskit/editor-common';
import Wrapper from '../Wrapper';

export interface Props {
  children: React.ReactElement<any>;
}

export interface State {
  error: Error | null;
}

export default class Boundary extends PureComponent<Props, State> {
  state: State = {
    error: null,
  };

  componentDidCatch(error) {
    // tslint:disable-next-line:no-console
    console.error('Renderer error occured', error);

    this.setState({ error });
  }

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <Wrapper>
        <UnsupportedBlock/>
      </Wrapper>
    );
  }
}
