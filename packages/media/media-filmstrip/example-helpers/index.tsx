import * as React from 'react';
import Checkbox from '@atlaskit/checkbox';
import {
  MutableCardContainer,
  MutableCardContentContainer,
} from '../example-helpers/styled';

export interface MutableCardProps {
  index: number;
  title: string;
  onSaveDivRef?: (el: HTMLElement) => void;
  isAnimating: boolean;
}

export interface MutableCardState {
  count: number;
}

export interface MutableCardContentProps {
  isAnimating: boolean;
}

export class MutableCardContent extends React.Component<
  MutableCardContentProps,
  {}
> {
  render() {
    const randomWidthValue = Math.round(Math.random() * 500);
    const width = this.props.isAnimating ? `${randomWidthValue}px` : '100%';
    return <MutableCardContentContainer style={{ width }} />;
  }
}

export class MutableCard extends React.Component<
  MutableCardProps,
  MutableCardState
> {
  intervalId: number;
  renderCount: number = 0;

  componentDidMount() {
    this.intervalId = setInterval(() => {
      const { isAnimating } = this.props;
      if (isAnimating) {
        this.forceUpdate();
      }
    }, 10);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  saveRef = el => {
    const { onSaveDivRef } = this.props;

    if (onSaveDivRef) {
      onSaveDivRef(el);
    }
  };

  render() {
    this.renderCount++;
    const { title, onSaveDivRef, isAnimating } = this.props;
    const isMutable = !!onSaveDivRef;
    return (
      <MutableCardContainer innerRef={this.saveRef} mutable={isMutable}>
        <h3>
          {title} [{this.renderCount}]
        </h3>
        <MutableCardContent isAnimating={isAnimating} />
        <Checkbox initiallyChecked={false} />
      </MutableCardContainer>
    );
  }
}
