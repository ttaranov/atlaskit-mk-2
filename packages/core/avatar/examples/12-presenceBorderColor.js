// @flow
import React from 'react';
import { css } from 'emotion';
import { gridSize } from '@atlaskit/theme';
import { Presence } from '../src';

const Container = props => (
  <div
    className={css({
      display: 'flex',
    })}
    {...props}
  />
);

const PresenceWrapper = props => (
  <div
    className={css({
      height: '30px;',
      width: '30px;',
      marginRight: `${gridSize}px;`,
    })}
    {...props}
  />
);

export default () => (
  <div>
    <h3>Custom background color</h3>
    <p>
      By default presences will display a white border. This can be overridden
      with the
      <code>borderColor</code> property.
    </p>
    <p>
      The <code>borderColor</code> property will accept any string that CSS
      border-color can e.g. hex, rgba, transparent, etc.
    </p>
    <Container>
      <PresenceWrapper>
        <Presence presence="online" />
      </PresenceWrapper>

      <PresenceWrapper>
        <Presence presence="busy" borderColor="rebeccapurple" />
      </PresenceWrapper>

      <PresenceWrapper>
        <Presence presence="offline" borderColor="rgba(0, 0, 255, 0.2)" />
      </PresenceWrapper>

      <PresenceWrapper>
        <Presence presence="focus" borderColor="transparent" />
      </PresenceWrapper>
    </Container>
  </div>
);
