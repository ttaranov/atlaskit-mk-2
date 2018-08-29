import * as React from 'react';
import { Component } from 'react';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import styled from 'styled-components';

export interface Props {
  animate?: boolean;
  offset?: number;
  onSize?: (event) => void; // : SizeEvent
  onScroll?: (event) => void;
  widthExists?: boolean;
}

const MarginResetWrapper = styled.div`
  margin-left: 0% !important;
  transform: translateX(0%) !important;
  ul {
    padding-left: 0px !important;
    li {
      padding: 0 0 !important;
    }
  }
`;

// Need padding-left override for media item drop-shadow
const Wrapper = styled.div`
  margin-bottom: 8px;
  &&& ul {
    padding: 0;
  }
`;
MarginResetWrapper.displayName = 'MarginResetWrapper';

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
    return !widthExists ? (
      <MarginResetWrapper>{content}</MarginResetWrapper>
    ) : (
      <Wrapper>{content}</Wrapper>
    );
  }
}
