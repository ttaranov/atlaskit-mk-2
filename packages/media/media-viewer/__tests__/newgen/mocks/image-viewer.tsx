import * as React from 'react';
import { Context, ProcessedFileState } from '@atlaskit/media-core';
import {
  AnalyticViewerProps,
  ViewerLoadPayload,
} from '../../../src/newgen/analytics';

export type ObjectUrl = string;
export const REQUEST_CANCELLED = 'request_cancelled';

let _payload: ViewerLoadPayload = { status: 'success' };
export const setViewerPayload = (payload: ViewerLoadPayload) => {
  _payload = payload;
};

export type ImageViewerProps = AnalyticViewerProps & {
  context: Context;
  item: ProcessedFileState;
  collectionName?: string;
  onClose?: () => void;
};

export class ImageViewer extends React.Component<ImageViewerProps, {}> {
  componentDidMount() {
    this.props.onLoad(_payload);
  }

  render() {
    return <div>so empty</div>;
  }
}
