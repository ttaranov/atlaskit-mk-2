// @flow
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { colors } from '@atlaskit/theme';
import Avatar from '../src/';
import { Wrapper, Note } from '../examples-util/styled';
import nucleusImage from '../examples-util/nucleus.png';
import { avatarUrl } from '../examples-util/constants';
import type { AvatarPropTypes, PresenceType, StatusType } from '../src/types';

const exampleColors: string[] = [
  colors.N800,
  colors.B500,
  colors.N20,
  colors.N0,
];

const presences: PresenceType[] = [null, 'online', 'offline', 'busy'];
// $FlowFixMe - adding null
const statuses: StatusType[] = [null, 'approved', 'locked', 'declined'];
const styles = {
  column: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: '0.5em 1em',
  },
  row: {
    alignItems: 'stretch',
    display: 'flex',
    height: 192,
    justifyContent: 'stretch',
    marginTop: '1em',
  },
};

const ColorColumn = (props: AvatarPropTypes) => (
  <div style={{ ...styles.column, backgroundColor: props.borderColor }}>
    <Avatar onClick={console.log} {...props} size="xlarge" />
    <Avatar onClick={console.log} {...props} />
  </div>
);
export default () => (
  <Wrapper>
    <h2>Coloured Backgrounds</h2>
    <Note>
      <p>
        The <code>presenceBorderColor</code> property is now{' '}
        <code>borderColor</code>
        which is consumed by {'<Avatar/>'} and passed on to {'<Presence/>'} and
        {' <Status/>'}.
      </p>
      <p>
        Try clicking/tabbing on the avatars to see how the focus ring interacts
        with the background color.
      </p>
    </Note>
    <div style={styles.row}>
      {exampleColors.map((color: string, index: number) => (
        <ColorColumn
          key={index}
          borderColor={color}
          src={avatarUrl}
          presence={presences[index]}
        />
      ))}
    </div>
    <div style={styles.row}>
      {exampleColors.map((color: string, index: number) => (
        <ColorColumn
          key={index}
          borderColor={color}
          src={nucleusImage}
          appearance="square"
          status={statuses[index]}
        />
      ))}
    </div>
  </Wrapper>
);
