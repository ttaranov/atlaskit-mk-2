import * as React from 'react';
import { ImageWrapper, Img } from '../../styled';
import { ZoomLevel } from '../../domain/zoomLevel';
import { closeOnDirectClick } from '../../utils/closeOnDirectClick';
import { ZoomControls } from '../../zoomControls';

export type Props = {
  src: string;
  onClose?: () => void;
};

export type State = {
  zoomLevel: ZoomLevel;
};

const initialState: State = {
  zoomLevel: new ZoomLevel(),
};

export class InteractiveImg extends React.Component<Props, State> {
  state: State = initialState;

  render() {
    const { src, onClose } = this.props;
    const { zoomLevel } = this.state;
    // We need to set new border value every time the zoom changes
    // to force a re layout in Chrome.
    // https://stackoverflow.com/questions/16687023/bug-with-transform-scale-and-overflow-hidden-in-chrome
    const border = `${zoomLevel.value / 100}px solid transparent`;
    // We use style attr instead of SC prop for perf reasons
    const imgStyle = {
      transform: `scale(${zoomLevel.value})`,
      border,
    };
    return (
      <ImageWrapper onClick={closeOnDirectClick(onClose)}>
        <Img src={src} style={imgStyle} />;
        <ZoomControls zoomLevel={zoomLevel} onChange={this.onZoomChange} />
      </ImageWrapper>
    );
  }

  private onZoomChange = (zoomLevel: ZoomLevel) => {
    this.setState({ zoomLevel });
  };
}
