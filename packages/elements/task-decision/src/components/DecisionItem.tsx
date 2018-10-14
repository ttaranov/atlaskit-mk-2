import * as React from 'react';
import { PureComponent } from 'react';

import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import { colors } from '@atlaskit/theme';

import { EditorIconWrapper } from '../styled/DecisionItem';
import Item from './Item';
import { Appearance, ContentRef, User } from '../types';

export interface Props {
  children?: any;
  contentRef?: ContentRef;
  placeholder?: string;
  showPlaceholder?: boolean;
  appearance?: Appearance;
  participants?: User[];
  showParticipants?: boolean;
  creator?: User;
  lastUpdater?: User;
}

export default class DecisionItem extends PureComponent<Props, {}> {
  public static defaultProps: Partial<Props> = {
    appearance: 'inline',
  };

  getAttributionText() {
    const { creator, lastUpdater } = this.props;
    const user = lastUpdater || creator;

    if (!user || !user.displayName) {
      return undefined;
    }

    return `Captured by ${user.displayName}`;
  }

  render() {
    const {
      appearance,
      children,
      contentRef,
      participants,
      placeholder,
      showPlaceholder,
    } = this.props;
    const iconColor = showPlaceholder ? colors.N100 : colors.G300;

    const icon = (
      <EditorIconWrapper color={iconColor}>
        <DecisionIcon label="Decision" size="large" />
      </EditorIconWrapper>
    );

    return (
      <Item
        appearance={appearance}
        contentRef={contentRef}
        icon={icon}
        participants={participants}
        placeholder={placeholder}
        showPlaceholder={showPlaceholder}
        attribution={this.getAttributionText()}
      >
        {children}
      </Item>
    );
  }
}
