import * as React from 'react';
import { Component } from 'react';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Button from '@atlaskit/button';
import {
  ContentWrapper,
  CloseButtonWrapper,
  hideControlsClassName,
} from './styled';

export interface ContentProps {
  onClick?: (e) => void;
  onClose?: () => void;
}

export interface ContentState {
  showControls: boolean;
}

const mouseMovementDelay = 2000;

export class Content extends Component<ContentProps, ContentState> {
  private checkActivityTimeout: number;
  state: ContentState = {
    showControls: true,
  };

  private clearTimeout = () => {
    window.clearTimeout(this.checkActivityTimeout);
  };

  private hideControls = () => this.setState({ showControls: false });

  private checkMouseMovement = () => {
    this.clearTimeout();
    this.setState({ showControls: true });
    this.checkActivityTimeout = window.setTimeout(
      this.hideControls,
      mouseMovementDelay,
    );
  };

  componentDidMount() {
    this.checkMouseMovement();
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  render() {
    const { showControls } = this.state;
    const { onClick, onClose, children } = this.props;

    return (
      <ContentWrapper
        showControls={showControls}
        onMouseMove={this.checkMouseMovement}
        onClick={onClick}
      >
        <CloseButtonWrapper className={hideControlsClassName}>
          <Button onClick={onClose} iconBefore={<CrossIcon label="Close" />} />
        </CloseButtonWrapper>
        {children}
      </ContentWrapper>
    );
  }
}
