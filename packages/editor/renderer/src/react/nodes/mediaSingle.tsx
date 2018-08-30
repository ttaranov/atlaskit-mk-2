import * as React from 'react';
import { Component, ReactElement } from 'react';
import styled from 'styled-components';
import {
  MediaSingle as UIMediaSingle,
  MediaSingleLayout,
} from '@atlaskit/editor-common';
import { BreakoutConsumer } from '../';
import MediaGroup from './mediaGroup';

export interface Props {
  children: ReactElement<any>;
  layout: MediaSingleLayout;
}

export interface State {
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 250;
const DEFAULT_HEIGHT = 200;

const ExtendedUIMediaSingle = styled(UIMediaSingle)`
  ${({ layout }) =>
    layout === 'full-width' || layout === 'wide'
      ? `
  margin-left: 50%;
  transform: translateX(-50%);
  `
      : ``} transition: all 0.1s linear;
`;

export default class MediaSingle extends Component<
  { layout: MediaSingleLayout } & React.Props<any>,
  State
> {
  constructor(props) {
    super(props);
    this.state = {}; // Need to initialize with empty state.
  }

  private onExternalImageLoaded = ({ width, height }) => {
    this.setState({
      width,
      height,
    });
  };

  render() {
    const { props } = this;

    const child = React.Children.only(
      React.Children.toArray(props.children)[0],
    );

    const media = React.cloneElement(child, {
      cardDimensions: {
        width: '100%',
        height: '100%',
      },
      onExternalImageLoaded: this.onExternalImageLoaded,
      disableOverlay: true,
    });

    let { width, height, type } = child.props;

    if (type === 'external') {
      const { width: stateWidth, height: stateHeight } = this.state;

      if (width === null) {
        width = stateWidth || DEFAULT_WIDTH;
      }

      if (height === null) {
        height = stateHeight || DEFAULT_HEIGHT;
      }
    }

    if (!height || !width) {
      return (
        <BreakoutConsumer>
          {containerWidth => <MediaGroup>{media}</MediaGroup>}
        </BreakoutConsumer>
      );
    }

    return (
      <BreakoutConsumer>
        {containerWidth => (
          <ExtendedUIMediaSingle
            layout={props.layout}
            width={width}
            height={height}
            containerWidth={containerWidth}
          >
            {media}
          </ExtendedUIMediaSingle>
        )}
      </BreakoutConsumer>
    );
  }
}
