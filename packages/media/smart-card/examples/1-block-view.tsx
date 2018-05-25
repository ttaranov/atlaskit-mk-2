import * as React from 'react';
import { CardFrame, IconImage } from '@atlaskit/media-ui';
import { Frame as CollapsedFrame } from '../src/block/collapsed/Frame';
import { LoadingView as CollapsedLoadingView } from '../src/block/collapsed/LoadingView';
import { ErroredView as CollapsedErroredView } from '../src/block/collapsed/ErroredView';
import { UnauthorisedView } from '../src/block/collapsed/UnauthorisedView';
import { ForbiddenView } from '../src/block/collapsed/ForbiddenView';
import { ResolvedView } from '../src/block/expanded/ResolvedView';

const CARD_WIDTH_MAX = 400;
const DROPBOX_ICON =
  'https://aem.dropbox.com/cms/content/dam/dropbox/www/en-us/branding/app-dropbox-windows@2x.png';

const log = (name: string) => () => console.log(name);

const CollapsedFrameWithDetails = ({
  children,
}: {
  children?: React.ReactNode;
}) => (
  <CollapsedFrame maxWidth={CARD_WIDTH_MAX} onClick={log('Open')}>
    {children}
  </CollapsedFrame>
);

const FrameWithDetails = ({ children }) => (
  <CardFrame
    icon={<IconImage src={DROPBOX_ICON} />}
    text="Dropbox"
    maxWidth={CARD_WIDTH_MAX}
  >
    {children}
  </CardFrame>
);

export default () => (
  <>
    <h4>Loading</h4>
    <CollapsedFrameWithDetails>
      <CollapsedLoadingView />
    </CollapsedFrameWithDetails>

    <h4>Errored</h4>
    <CollapsedFrameWithDetails>
      <CollapsedErroredView
        message="We stumbled a bit here"
        onRetry={log('Retry')}
        onDismis={log('Dismis')}
      />
    </CollapsedFrameWithDetails>

    <h4>Unauthenticated</h4>
    <CollapsedFrameWithDetails>
      <UnauthorisedView
        icon={DROPBOX_ICON}
        service="Dropbox"
        onAuthorise={log('Authorise')}
      />
    </CollapsedFrameWithDetails>

    <h4>Forbidden</h4>
    <CollapsedFrameWithDetails>
      <ForbiddenView icon={DROPBOX_ICON} onAuthorise={log('Authorise')} />
    </CollapsedFrameWithDetails>

    <h4>Resolved</h4>
    <FrameWithDetails>
      <ResolvedView
        title={{ text: 'Spec for Smart Card actions' }}
        description={{ text: 'Modified 59 seconds ago by Scott Simpson' }}
        details={[
          {
            title: 'Size',
            text: '44.5MB',
          },
        ]}
      />
    </FrameWithDetails>
  </>
);
