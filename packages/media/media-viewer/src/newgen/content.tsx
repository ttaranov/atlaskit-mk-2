import * as React from 'react';
import { Component } from 'react';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Button from '@atlaskit/button';
import { ContentWrapper, CloseButtonWrapper } from './styled';

export interface ContentProps {
  onClick: (e) => void;
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

  // We want to check mouse movement on click too
  // in order to not hide controls when user is interacting with any control
  private onClick = e => {
    const { onClick } = this.props;
    this.checkMouseMovement();
    onClick(e);
  };

  render() {
    const { showControls } = this.state;
    const { onClose, children } = this.props;

    return (
      <ContentWrapper
        showControls={showControls}
        onMouseMove={this.checkMouseMovement}
        onClick={this.onClick}
      >
        <CloseButtonWrapper>
          <Button onClick={onClose} iconBefore={<CrossIcon label="Close" />} />
        </CloseButtonWrapper>
        {children}
      </ContentWrapper>
    );
  }
}
