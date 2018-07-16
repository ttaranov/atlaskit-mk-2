// @flow
import React, { PureComponent, type Element as ReactElement } from 'react';
import AkLayer from '@atlaskit/layer';

import PositionWrapper from './components/PositionWrapper';
import withOuterListeners from './components/withOuterListeners';
import AkProfilecardResourced from './profilecard-resourced';

import { AnimationWrapper } from './styled/Trigger';

import type {
  ProfileCardAction,
  ProfilecardTriggerPosition,
  ProfileClient,
} from './types';

const AkLayerWithOuterListeners = withOuterListeners(AkLayer);

type Props = {
  children: ReactElement<*>,
  position: ProfilecardTriggerPosition,
  userId: string,
  cloudId: string,
  actions: Array<ProfileCardAction>,
  resourceClient: ProfileClient,
  trigger: 'click' | 'hover',
  analytics?: Function,
};

type State = {
  visible: boolean,
  isFlipped: boolean,
};

export default class ProfilecardTrigger extends PureComponent<Props, State> {
  showDelay: number = 500;
  hideDelay: number = 500;
  showTimer: any;
  hideTimer: any;

  static defaultProps = {
    position: 'top left',
    actions: [],
    trigger: 'hover',
  };

  state = {
    visible: false,
    isFlipped: false,
  };

  handleLayerFlipChange = ({ flipped }: { flipped: boolean }) => {
    this.setState({ isFlipped: flipped });
  };

  hideProfilecard = () => {
    clearTimeout(this.showTimer);

    this.hideTimer = setTimeout(() => {
      this.setState({ visible: false });
    }, this.hideDelay);
  };

  showProfilecard = () => {
    clearTimeout(this.hideTimer);

    this.showTimer = setTimeout(() => {
      this.setState({ visible: true });
    }, this.showDelay);
  };

  renderProfilecard() {
    return (
      <PositionWrapper
        position={this.props.position}
        isFlipped={this.state.isFlipped}
      >
        <AnimationWrapper
          position={this.props.position}
          isFlipped={this.state.isFlipped}
        >
          <AkProfilecardResourced
            userId={this.props.userId}
            cloudId={this.props.cloudId}
            resourceClient={this.props.resourceClient}
            actions={this.props.actions}
            analytics={this.props.analytics}
          />
        </AnimationWrapper>
      </PositionWrapper>
    );
  }

  render() {
    const { children, position, trigger } = this.props;

    const Layer = trigger === 'hover' ? AkLayer : AkLayerWithOuterListeners;
    const containerListeners = {};
    const layerListeners = {};

    if (trigger === 'hover') {
      containerListeners.onMouseEnter = this.showProfilecard;
      containerListeners.onMouseLeave = this.hideProfilecard;
    } else {
      containerListeners.onClick = this.showProfilecard;

      layerListeners.handleClickOutside = this.hideProfilecard;
      layerListeners.handleEscapeKeydown = this.hideProfilecard;
    }

    return (
      <div
        style={{ display: 'inline-block', maxWidth: '100%' }}
        {...containerListeners}
      >
        {this.state.visible ? (
          <Layer
            autoFlip
            content={this.renderProfilecard()}
            offset="0 4"
            onFlippedChange={this.handleLayerFlipChange}
            position={position}
            {...layerListeners}
          >
            {children}
          </Layer>
        ) : (
          children
        )}
      </div>
    );
  }
}
