// @flow
import React, { PureComponent } from 'react';

import NothingWasFoundElement from '../styled/NothingWasFound';

type Props = {
  noMatchesFound: string,
};

export default function NothingWasFound (props) {
  render() {
    return (
      <NothingWasFoundElement>
        {this.props.noMatchesFound}
      </NothingWasFoundElement>
    );
  }
}
