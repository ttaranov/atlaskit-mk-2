import * as React from 'react';
import { Component } from 'react';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import styled from 'styled-components';

export interface Props {
  animate?: boolean;
  offset?: number;
  onSize?: (event) => void;
  onScroll?: (event) => void;
  widthExists?: boolean;
}

// Override layout when null width image has layout like `full-width`
const overrideStyles = {
  'margin-left': '0',
  transform: 'translateX(0)',
};

// Need padding-left override for media item drop-shadow
const Wrapper = styled.div`
  margin-bottom: 8px;
  &&&& ul {
    padding: 0;
  }
`;

export default class MediaBase extends Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      animate,
      offset,
      onSize,
      onScroll,
      widthExists = true,
    } = this.props;

    const content = (
      <FilmstripView
        animate={animate}
        offset={offset}
        onSize={onSize}
        onScroll={onScroll}
      >
        {this.props.children}
      </FilmstripView>
    );

    return (
      <Wrapper style={!widthExists ? overrideStyles : undefined}>
        {content}
      </Wrapper>
    );
  }
}
