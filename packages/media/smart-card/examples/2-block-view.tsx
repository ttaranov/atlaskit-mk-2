import * as React from 'react';
import { CardFrame, IconImage } from '@atlaskit/media-ui';
import { CollapsedFrame } from '../src/block/CollapsedFrame';
import { LoadingView as CollapsedLoadingView } from '../src/block/LoadingView';
import { ErroredView as CollapsedErroredView } from '../src/block/ErroredView';
import { UnauthorisedView } from '../src/block/UnauthorisedView';
import { ForbiddenView } from '../src/block/ForbiddenView';
import { ResolvedView } from '../src/block/ResolvedView';

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
      <ResolvedView title={{ text: 'foo bar' }} byline={{ text: 'foo bar' }} />
    </FrameWithDetails>
    <br />
    <br />
    <FrameWithDetails>
      <ResolvedView
        user={{
          name: 'Foo bar',
        }}
        title={{
          text:
            'The public is more familiar with bad design than good design. It is, in effect, conditioned to prefer bad design, because that is what it lives with. The ne',
        }}
        byline={{
          text: 'Entity byline (not description) is limited to a single line',
        }}
        description={{
          text:
            'Descriptions can be added in the meta data area using the text display. They are used to show additional information on the object and can be up to three lines',
        }}
        details={[
          {
            title: 'Size',
            text: '44.5MB',
          },
          {
            lozenge: {
              text: 'foobar',
            },
          },
          {
            title: 'Size',
            text: '44.5MB',
          },
          {
            lozenge: {
              text: 'foobar',
            },
          },
          {
            title: 'Size',
            text: '44.5MB',
          },
          {
            lozenge: {
              text: 'foobar',
            },
          },
          {
            title: 'Size',
            text: '44.5MB',
          },
          {
            lozenge: {
              text: 'foobar',
            },
          },
        ]}
        users={[
          { name: 'James' },
          { name: 'Scotty' },
          { name: 'Artur' },
          { name: 'Adam' },
          { name: 'Sherif' },
          { name: 'Waldemar' },
        ]}
        actions={[
          {
            text: 'Success',
            handler: ({ success }) => success('Success!'),
          },
          {
            text: 'Failure',
            handler: ({ failure }) => failure(),
          },
          {
            text: 'Pending',
            handler: ({ pending }) => pending(),
          },
        ]}
      />
    </FrameWithDetails>
  </>
);
