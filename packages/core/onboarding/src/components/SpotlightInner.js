// @flow
import React from 'react';
import { layers } from '@atlaskit/theme';
import Portal from '@atlaskit/portal';
import ScrollLock from 'react-scrolllock';
import scrollIntoView from 'scroll-into-view-if-needed';
import { Fade } from './Animation';
import Clone from './Clone';
import SpotlightDialog from './SpotlightDialog';
import { SpotlightTransitionConsumer } from './SpotlightTransition';
import { type Props as SpotlightProps } from './Spotlight';

export type Props = SpotlightProps & {
  onOpened: () => any,
  onClosed: () => any,
};

class SpotlightInner extends React.Component<Props> {
  static defaultProps = {
    dialogWidth: 400,
    pulse: true,
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.targetNode !== this.props.targetNode) {
      scrollIntoView(this.props.targetNode, {
        scrollMode: 'if-needed',
      });
    }
  }

  componentDidMount() {
    scrollIntoView(this.props.targetNode, {
      scrollMode: 'if-needed',
    });
    this.props.onOpened();
  }

  componentWillUnmount() {
    this.props.onClosed();
  }

  render() {
    const {
      pulse,
      target,
      targetNode,
      targetBgColor,
      targetOnClick,
      targetRadius,
      targetReplacement,
    } = this.props;
    return (
      <SpotlightTransitionConsumer>
        {({ isOpen, onExited }) => (
          <Portal zIndex={layers.spotlight() + 1}>
            <Clone
              pulse={pulse}
              target={target}
              targetBgColor={targetBgColor}
              targetNode={targetNode}
              targetOnClick={targetOnClick}
              targetRadius={targetRadius}
              targetReplacement={targetReplacement}
            />
            <Fade in={isOpen} onExited={onExited}>
              {animationStyles => (
                <SpotlightDialog
                  {...this.props}
                  isOpen={isOpen}
                  animationStyles={animationStyles}
                />
              )}
            </Fade>
            <ScrollLock />
          </Portal>
        )}
      </SpotlightTransitionConsumer>
    );
  }
}

export default SpotlightInner;
