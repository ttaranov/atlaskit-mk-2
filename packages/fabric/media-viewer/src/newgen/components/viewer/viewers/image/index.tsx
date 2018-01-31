import * as React from 'react';
import {Component} from 'react';
import {Action, ActionType} from '../../../../domain';

export interface ImageViewerProps {
  url: string;
  zoomLevel: number; // TODO implement
}

export interface ImageViewerState {
  
}

export const ImageViewerActions: Action[] = [{
  text: 'edit', // TODO: i18n
  type: ActionType.Edit,
  active: false
}];

export class ImageViewer extends Component<ImageViewerProps, ImageViewerState> {

  render() {
    const {url, zoomLevel} = this.props;

    // TODO
    // img onError will be bubbled up (onError prop)
    // img onLoad will also be bubbled up (onLoad prop)

    const transform = `scale(${zoomLevel/100}) translateZ(0)`;
    return (
      <div>
        <img src={url} style={{transform}} />
        <div>
          zoom level: <strong>{zoomLevel}</strong>
        </div>
      </div>
    );
  }
}
