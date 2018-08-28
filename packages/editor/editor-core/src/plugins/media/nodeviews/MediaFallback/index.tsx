import * as React from 'react';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import styled from 'styled-components';

export interface Props {
  animate: boolean;
  offset: number;
  onSize: Function;
  onScroll: Function;
}

// Need `padding-left` override for media item drop-shadow
const Wrapper = styled.div`
  margin-bottom: 8px;
  &&& ul {
    padding: 0;
  }
`;

export default function MediaFallback({
  animate,
  offset,
  onSize,
  onScroll,
}: Props) {
  // const { animate, offset } = this.state;
  return (
    <Wrapper>
      <FilmstripView
        animate={animate}
        offset={offset}
        onSize={this.handleSize}
        onScroll={this.handleScroll}
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
