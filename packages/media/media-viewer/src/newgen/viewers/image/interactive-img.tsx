import * as React from 'react';
import { Img } from '../../styled';
import { ZoomLevel } from '../../domain/zoomLevel';

export type Props = {
  src: string;
  zoomLevel: ZoomLevel;
};

export class InteractiveImg extends React.Component<Props, {}> {
  render() {
    const { src, zoomLevel } = this.props;
    // We need to set new border value every time the zoom changes
    // to force a re layout in Chrome.
    // https://stackoverflow.com/questions/16687023/bug-with-transform-scale-and-overflow-hidden-in-chrome
    const border = `${zoomLevel.value / 100}px solid transparent`;
    // We use style attr instead of SC prop for perf reasons
    const imgStyle = {
      transform: `scale(${zoomLevel.value})`,
      border,
    };
    return <Img src={src} style={imgStyle} />;
  }
}
