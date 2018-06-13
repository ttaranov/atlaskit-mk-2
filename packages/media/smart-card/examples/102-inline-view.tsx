import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { LinkView } from '../src/inline/LinkView';
import { ResolvedView } from '../src/inline/ResolvedView';
import { ResolvingView } from '../src/inline/ResolvingView';

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
