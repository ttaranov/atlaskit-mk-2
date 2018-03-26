// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AkProfilecardTrigger } from '../../src';

const positionsOrder = [
  'top left',
  'right bottom',
  'right top',
  'bottom left',
  'bottom right',
  'left top',
  'left bottom',
  'top right',
];

const triggerStyles = {
  display: 'flex',
  width: '48px',
  height: '48px',
  borderRadius: '48px',
  background: '#FF5630',
  color: '#fff',
  fontSize: '16px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
};

type Props = {
  resourceClient: Function,
};

type State = {
  positionIdx: number,
};

export default class InteractiveTrigger extends Component<Props, State> {
  static propTypes = {
    resourceClient: PropTypes.shape({
      getProfile: PropTypes.func,
      getCachedProfile: PropTypes.func,
      makeRequest: PropTypes.func,
    }),
  };

  state = {
    positionIdx: 0,
  };

  getPositionDisplayString() {
    return positionsOrder[this.state.positionIdx]
      .toUpperCase()
      .split(' ')
      .reduce((prev, current) => `${prev}${current.charAt(0)}`, '');
  }

  changePosition = () => {
    this.setState({
      positionIdx:
        this.state.positionIdx === positionsOrder.length - 1
          ? 0
          : this.state.positionIdx + 1,
    });
  };

  renderTrigger() {
    return (
      <button style={triggerStyles} onClick={this.changePosition}>
        {this.getPositionDisplayString()}
      </button>
    );
  }

  render() {
    return (
      <div>
        <p>
          Hover over the circle to show the profilecard and click to change the
          cards position.
        </p>
        <AkProfilecardTrigger
          cloudId="DUMMY-10ae0bf3-157e-43f7-be45-f1bb13b39048"
          userId="3"
          position={positionsOrder[this.state.positionIdx]}
          resourceClient={this.props.resourceClient}
          actions={[
            {
              label: 'View profile',
              id: 'view-profile',
              callback: () => {},
            },
          ]}
        >
          {this.renderTrigger()}
        </AkProfilecardTrigger>
      </div>
    );
  }
}
