import * as React from 'react';
import { PureComponent } from 'react';
import AvatarGroupType from '@atlaskit/avatar-group';

import { colors } from '@atlaskit/theme';
import Loadable from 'react-loadable';

const AvatarGroup = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal-task-decision-avatargroup" */
    '@atlaskit/avatar-group').then(module => module.default),
  loading: () => null,
}) as typeof AvatarGroupType;

import { Participant } from '../types';

export interface Props {
  participants: Participant[];
}

export default class Partipants extends PureComponent<Props, {}> {
  private getAvatarData() {
    return this.props.participants.map(p => ({
      src: p.avatarUrl,
      name: p.displayName,
      size: 'small',
    }));
  }

  render() {
    return (
      <AvatarGroup
        appearance="stack"
        borderColor={colors.N20}
        maxCount={4}
        size="small"
        data={this.getAvatarData()}
        boundariesElement="scrollParent"
      />
    );
  }
}
