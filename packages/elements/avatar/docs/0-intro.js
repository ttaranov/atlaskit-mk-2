// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  ### Usage

  This package exports an number of different Avatar related components
  \`\`\`js
  import Avatar, { AvatarGroup, AvatarItem, Presence, Status } from '@atlaskit/avatar';
  \`\`\`

  Use the \`Avatar\` component to represent users with their
  profile picture. Optionally, a presence to indicate online status can also
  be displayed.

  You can use the \`Presence\` component independently for contexts
  where the profile picture is not required (e.g. next to a username)

  ${(
    <Example
      Component={require('../examples/0-avatar').default}
      title="Avatar"
      source={require('!!raw-loader!../examples/0-avatar')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/1-avatarGroup').default}
      title="AvatarGroup"
      source={require('!!raw-loader!../examples/1-avatarGroup')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/3-presence').default}
      title="Presence"
      source={require('!!raw-loader!../examples/3-presence')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/4-status').default}
      title="Status"
      source={require('!!raw-loader!../examples/4-status')}
    />
  )}

  ## Props

  > Currently this is not provided as we are experiencing a flow type generation issue
`;
