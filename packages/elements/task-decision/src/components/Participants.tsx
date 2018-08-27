import * as React from 'react';
import { PureComponent } from 'react';
import AvatarGroup from '@atlaskit/avatar-group';
import { colors } from '@atlaskit/theme';

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
