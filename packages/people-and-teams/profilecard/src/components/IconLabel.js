// @flow
import React, { PureComponent, type Node as ReactNode } from 'react';
import IconLocation from '@atlaskit/icon/glyph/location';
import IconRecent from '@atlaskit/icon/glyph/recent';
import IconMention from '@atlaskit/icon/glyph/mention';
import IconEmail from '@atlaskit/icon/glyph/email';
import { Presence } from '@atlaskit/avatar';

import {
  DetailsLabel,
  DetailsLabelIcon,
  DetailsLabelText,
} from '../styled/Card';

const icons = {
  location: IconLocation,
  time: IconRecent,
  mention: IconMention,
  email: IconEmail,
  available: () => <Presence presence="online" borderColor="transparent" />,
  unavailable: () => <Presence presence="offline" borderColor="transparent" />,
  busy: () => <Presence presence="busy" borderColor="transparent" />,
  focus: () => <Presence presence="focus" borderColor="transparent" />,
};

type Props = {
  icon: string,
  children?: ReactNode,
};

export default class IconLabel extends PureComponent<Props> {
  static defaultProps = {
    icon: '',
  };

  render() {
    if (!this.props.children) {
      return null;
    }

    const IconElement = this.props.icon && icons[this.props.icon];
    const displayIcon = IconElement ? (
      <IconElement label={`icon ${this.props.icon}`} size="small" />
    ) : null;

    return (
      <DetailsLabel>
        <DetailsLabelIcon>{displayIcon}</DetailsLabelIcon>
        <DetailsLabelText>{this.props.children}</DetailsLabelText>
      </DetailsLabel>
    );
  }
}
