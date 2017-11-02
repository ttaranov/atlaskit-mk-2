// @flow

import React, { PureComponent } from 'react';
import { Target } from './styled';
import type { Color } from './styled';
import Tooltip from '../src/';

const VALID_PLACEMENTS = ['top', 'right', 'bottom', 'left'];

export default class PlacementExample extends PureComponent {
  // store the direction as an index and pull it from the list above,
  // just to simplify the `changeDirection` logic
  state : {| placement: number |} = { placement: 0 }
  props: {| color: Color |}
  static defaultProps = {
    color: 'blue',
  }

  changeDirection = () => {
    this.setState({
      placement: (this.state.placement + 1) % VALID_PLACEMENTS.length,
    });
  }

  render() {
    const placement = VALID_PLACEMENTS[this.state.placement];

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onClick={this.changeDirection}>
        <Tooltip content={placement} placement={placement}>
          <Target color={this.props.color}>Target</Target>
        </Tooltip>
      </div>
    );
  }
}
