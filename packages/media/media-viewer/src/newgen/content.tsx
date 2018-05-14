import * as React from 'react';
import { Component } from 'react';
import { ContentWrapper } from './styled';

export interface ContentProps {
  onClick?: (e) => void;
}

export interface ContentState {
  showControls: boolean;
}

export class Content extends Component<ContentProps, ContentState> {
  checkActivityTimeout: number;
  state: ContentState = {
    showControls: true,
  };

  private clearTimeout = () => {
    window.clearTimeout(this.checkActivityTimeout);
  };

  private hideControls = () => this.setState({ showControls: false });

  onMouseMove = () => {
    this.clearTimeout();
    this.setState({ showControls: true });
    this.checkActivityTimeout = window.setTimeout(this.hideControls, 2000);
  };

  componentWillUnmount() {
    this.clearTimeout();
  }

  render() {
    const { showControls } = this.state;
    const { onClick, children } = this.props;

    return (
      <ContentWrapper
        showControls={showControls}
        onMouseMove={this.onMouseMove}
        onClick={onClick}
      >
        {children}
      </ContentWrapper>
    );
  }
}
