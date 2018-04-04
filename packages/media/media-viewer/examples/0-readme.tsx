import * as React from 'react';

export default () => (
  <div>
    <h2>Current Media Viewer</h2>
    <p>
      Currently we don't support examples for this package since it has a
      implicit dependency on the old MediaViewer (@atlassian/mediaviewer) that
      lives in the private Atlassian registry.
    </p>

    <p>
      In order to see a demo of it working, please have a look into the{' '}
      <a href="https://media-playground.internal.app.dev.atlassian.io/chat">
        MediaPlayground
      </a>
    </p>

    <h2>Media Viewer Next Generation</h2>
    <p>
      The <b>statefull</b> examples exercise Media Viewer using the Media API store.
    </p>

    <p>
      The <b>stateless</b> examples exercise Media Viewer views using a static data model.
    </p>

  </div>
);
