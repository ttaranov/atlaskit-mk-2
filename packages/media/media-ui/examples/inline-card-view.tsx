import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { LinkView, ResolvedView, ResolvingView } from '../src/InlineCard';
import { AuthErrorView } from '../src/inline/AuthErrorView';
import { NoPermissionsView } from '../src/inline/NoPermissionsView';

interface Lozenge {
  text: string;
  appearance: 'inprogress';
}

const url = 'https://product-fabric.atlassian.net/browse/MSW-524';
const icon =
  'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg';
const title = 'MSW-524: [RFC] Api for inline Link cards UI component';
const lozenge: Lozenge = {
  text: 'in progress',
  appearance: 'inprogress',
};
const onClick = () => window.open(url);

export default () => (
  <Page>
    <Grid>
      <GridColumn>
        <h4>LinkView (initial Resolving/Errored)</h4>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a semper
        ex, vel molestie arcu. Phasellus commodo this is <code>LinkView</code>:
        <LinkView text={url} onClick={onClick} />
        quam eu vulputate blandit. Nullam consequat auctor condimentum. Praesent
        laoreet ultricies libero egestas mattis. Nulla iaculis ullamcorper nisl
        ut vehicula. Donec volutpat libero id ullamcorper faucibus. Sed
        vestibulum tincidunt tortor ut laoreet. Nulla posuere, nisi et aliquet
        interdum, nunc mauris bibendum mauris, in consequat mi est vitae mauris.
        Phasellus dictum sollicitudin nunc in gravida.
        <h4>ResolvingView</h4>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a semper
        ex, vel molestie arcu. Phasellus commodo this is{' '}
        <code>ResolvingView</code>:
        <ResolvingView url={url} onClick={onClick} />
        quam eu vulputate blandit. Nullam consequat auctor condimentum. Praesent
        laoreet ultricies libero egestas mattis. Nulla iaculis ullamcorper nisl
        ut vehicula. Donec volutpat libero id ullamcorper faucibus. Sed
        vestibulum tincidunt tortor ut laoreet. Nulla posuere, nisi et aliquet
        interdum, nunc mauris bibendum mauris, in consequat mi est vitae mauris.
        Phasellus dictum sollicitudin nunc in gravida.
        <h4>Auth Error View</h4>
        Qui proident do ipsum elit eu commodo ex. Eiusmod reprehenderit occaecat
        ipsum laboris. Velit incididunt esse eu ipsum et laboris eiusmod magna
        irure adipisicing adipisicing eiusmod ex veniam. Sunt velit et pariatur
        amet et magna sunt ea id eu ullamco laboris.
        <AuthErrorView
          url={url}
          onClick={() => {}}
          onRetry={() => {
            alert('Trying hard!');
          }}
        />
        mollit nulla laboris est occaecat commodo veniam sit duis eiusmod.
        Officia reprehenderit do ut reprehenderit incididunt laborum Lorem enim
        irure consectetur pariatur dolor. Duis irure voluptate aute consequat
        ullamco nostrud officia eiusmod non veniam do dolor non in.
        <h4>No Permissions View</h4>
        Reprehenderit non occaecat do non esse irure aute aliqua minim
        exercitation. Sit nisi tempor voluptate
        <NoPermissionsView
          url={url}
          onClick={() => {
            alert("Clicking me won't fix the permissions...");
          }}
          onRetry={() => {
            alert('Okay, what else have we got...');
          }}
        />{' '}
        cillum aute reprehenderit officia quis irure quis. Do nostrud est sit
        aute exercitation ut sit. Exercitation tempor laborum culpa ullamco
        ullamco in laboris.
        <h4>ResolvedView</h4>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a semper
        ex, vel molestie arcu. Phasellus commodo this is{' '}
        <code>ResolvedView</code>:
        <ResolvedView title={title} onClick={onClick} />
        quam eu vulputate blandit. Nullam consequat auctor condimentum. Praesent
        laoreet ultricies libero egestas mattis. Nulla iaculis ullamcorper nisl
        ut this is <code>ResolvedView</code>:
        <ResolvedView
          icon={icon}
          title={title}
          lozenge={lozenge}
          onClick={onClick}
        />
        vehicula. Donec volutpat libero id ullamcorper faucibus. Sed vestibulum
        tincidunt tortor ut laoreet. Nulla posuere, nisi et aliquet interdum,
        <code>ResolvedView (selected)</code>:
        <ResolvedView
          icon={icon}
          title={title}
          lozenge={lozenge}
          isSelected={true}
          onClick={onClick}
        />
        nunc mauris bibendum mauris, in consequat mi est vitae mauris. Phasellus
        dictum sollicitudin nunc in gravida.
      </GridColumn>
    </Grid>
  </Page>
);
