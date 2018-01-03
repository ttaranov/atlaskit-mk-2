// @flow
import React, { PureComponent } from 'react';

import NothingWasFoundElement from '../styled/NothingWasFound';

type Props = {
  noMatchesFound: string,
};

export default class NothingWasFound extends PureComponent<Props, {}> {
  render() {
    return (
      <NothingWasFoundElement>
        {this.props.noMatchesFound}
      </NothingWasFoundElement>
    );
  }
}
