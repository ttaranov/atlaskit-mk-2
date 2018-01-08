import * as React from 'react';
import { action, storiesOf } from '@kadira/storybook';

import { name } from '../package.json';
import Mention from '../src/components/Mention';
import ResourcedMention from '../src/components/Mention/ResourcedMention';
import {
  mentionData,
  mentionProvider,
} from '../test/unit/_mock-mention-provider';
import { akColorN20 } from '@atlaskit/util-shared-styles';
import { AnalyticsListener } from '@atlaskit/analytics';
import debug from '../src/util/logger';

function withN20Container(mention) {
  return (
    <div style={{ backgroundColor: akColorN20, width: '100%', height: '100%' }}>
      {mention}
    </div>
  );
}

function listenerHandler(eventName: string, eventData: Object) {
  debug(`AnalyticsListener event: ${eventName} `, eventData);
}

storiesOf(`${name}/Mention`, module)
  .add('Default', () => (
    <AnalyticsListener onEvent={listenerHandler} matchPrivate={true}>
      <Mention
        {...mentionData}
        accessLevel={'CONTAINER'}
        onClick={action('onClick')}
        onMouseEnter={action('onMouseEnter')}
        onMouseLeave={action('onMouseLeave')}
      />
    </AnalyticsListener>
  ))
  .add('Default on N20 background', () => {
    return withN20Container(
      <Mention
        {...mentionData}
        accessLevel={'CONTAINER'}
        onClick={action('onClick')}
        onMouseEnter={action('onMouseEnter')}
        onMouseLeave={action('onMouseLeave')}
      />,
    );
  })
  .add('Highlighted', () => (
    <Mention
      {...mentionData}
      isHighlighted={true}
      onClick={action('onClick')}
      onMouseEnter={action('onMouseEnter')}
      onMouseLeave={action('onMouseLeave')}
    />
  ))
  .add('Highlighted on N20 background', () => {
    return withN20Container(
      <Mention
        {...mentionData}
        isHighlighted={true}
        onClick={action('onClick')}
        onMouseEnter={action('onMouseEnter')}
        onMouseLeave={action('onMouseLeave')}
      />,
    );
  })
  .add('Default resourced', () => (
    <ResourcedMention
      {...mentionData}
      accessLevel={'CONTAINER'}
      mentionProvider={mentionProvider}
      onClick={action('onClick')}
      onMouseEnter={action('onMouseEnter')}
      onMouseLeave={action('onMouseLeave')}
    />
  ))
  .add('Highlighted resourced', () => (
    <ResourcedMention
      id="oscar"
      text="@Oscar Wallhult"
      mentionProvider={mentionProvider}
      onClick={action('onClick')}
      onMouseEnter={action('onMouseEnter')}
      onMouseLeave={action('onMouseLeave')}
    />
  ))
  .add('No access', () => (
    // push it down so that the tooltip doesn't get clipped at the top which would result in the tooltip
    // position being flipped from right to left
    <div style={{ marginTop: '10px' }}>
      <Mention
        {...mentionData}
        accessLevel={'NONE'}
        onClick={action('onClick')}
        onMouseEnter={action('onMouseEnter')}
        onMouseLeave={action('onMouseLeave')}
      />
    </div>
  ))
  .add('No access on N20 background', () => {
    return withN20Container(
      <div style={{ marginTop: '10px' }}>
        <Mention
          {...mentionData}
          accessLevel={'NONE'}
          onClick={action('onClick')}
          onMouseEnter={action('onMouseEnter')}
          onMouseLeave={action('onMouseLeave')}
        />
      </div>,
    );
  });
