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

export default class MediaFallback extends Component<Props, {}> {
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

      // <Wrapper
      //   layout={layout}
      //   width={width}
      //   height={height}
      //   containerWidth={containerWidth}
      //   className={classnames('media-single', layout, className, {
      //     'is-loading': isLoading,
      //     'media-wrapped': layout === 'wrap-left' || layout === 'wrap-right',
      //   })}
      // >
      //   <h1>Media Fallback</h1>
      //   {React.Children.only(children)}
      // </Wrapper>
    );
  }
}
