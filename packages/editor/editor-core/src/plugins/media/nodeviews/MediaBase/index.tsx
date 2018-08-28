import * as React from 'react';
import { Component } from 'react';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import styled from 'styled-components';

export interface Props {
  animate?: boolean;
  offset?: number;
  onSize?: (event) => void; // : SizeEvent
  onScroll?: (event) => void;
}

// Need `padding-left` override for media item drop-shadow
const Wrapper = styled.div`
  margin-bottom: 8px;
  &&& ul {
    padding: 0;
  }
`;

export default class MediaBase extends Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    const { animate, offset, onSize, onScroll } = this.props;
    return (
      <Wrapper>
        <FilmstripView
          animate={animate}
          offset={offset}
          onSize={onSize}
          onScroll={onScroll}
        >
          {this.props.children}
        </FilmstripView>
      </Wrapper>
    );
  }
}
