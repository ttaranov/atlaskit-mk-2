import { MediaViewerRenderer } from '../src/newgen/media-viewer-renderer';
import * as React from 'react';
import { listErrorSelectedItem } from '../example-helpers/';

export default class Example extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <MediaViewerRenderer
          model={listErrorSelectedItem}
          dispatcher={(action) => { console.log(action) }}
        />
      </div>
    );
  }
}
