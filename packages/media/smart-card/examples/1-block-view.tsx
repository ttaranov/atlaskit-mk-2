import * as React from 'react';
import { CardFrame, IconImage } from '@atlaskit/media-ui';
import { UnauthorisedView } from '../src/block/UnauthorisedView';
import { DetailView } from '../src/block/DetailView';
import { ErrorView } from '../src/block/ErrorView';

const log = (name: string) => () => console.log(name);

const ExampleFrame = ({ children }) => (
  <CardFrame
    icon={
      <IconImage src="https://aem.dropbox.com/cms/content/dam/dropbox/www/en-us/branding/app-dropbox-windows@2x.png" />
    }
    text="Dropbox"
    maxWidth={400}
  >
    {children}
  </CardFrame>
);

export default () => (
  <>
    <h4>Unauthorised</h4>
    <ExampleFrame>
      <UnauthorisedView service="Dropbox" onAuthenticate={log('Connect')} />
    </ExampleFrame>

    <h4>Details</h4>
    <ExampleFrame>
      <DetailView
        title={{ text: 'Spec for Smart Card actions' }}
        description={{ text: 'Modified 59 seconds ago by Scott Simpson' }}
        details={[
          {
            title: 'Size',
            text: '44.5MB',
          },
        ]}
      />
    </ExampleFrame>

    <h4>Error</h4>
    <ErrorView hasPreview={false} minWidth={400} maxWidth={400} />
  </>
);
