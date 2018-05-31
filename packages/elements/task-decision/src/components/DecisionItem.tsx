import * as React from 'react';
import { PureComponent } from 'react';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import { colors } from '@atlaskit/theme';
import { EditorIconWrapper } from '../styled/DecisionItem';
import Item from './Item';
import { Appearance, ContentRef, User } from '../types';
import { ReminderAdornment } from './ReminderAdornment';
import { ParticipantsAdornment } from './ParticipantsAdornment';

export interface Props {
  children?: any;
  contentRef?: ContentRef;
  showPlaceholder?: boolean;
  appearance?: Appearance;
  participants?: User[];
  showParticipants?: boolean;
  creator?: User;
  lastUpdater?: User;
  onReminderSet?: (value?: string) => void;
}

export default class DecisionItem extends PureComponent<Props, {}> {
  public static defaultProps: Partial<Props> = {
    appearance: 'inline',
  };

  getAttributionText() {
    const { creator, lastUpdater, appearance } = this.props;
    const user = lastUpdater || creator;

    if (!user || !user.displayName || appearance === 'inline') {
      return undefined;
    }

    return `Captured by ${user.displayName}`;
  }

  handleReminderSet = reminder => {
    if (this.props.onReminderSet) {
      this.props.onReminderSet(reminder);
    }
  };

  render() {
    const {
      appearance,
      children,
      contentRef,
      participants,
      showPlaceholder,
    } = this.props;
    const iconColor = showPlaceholder ? colors.N100 : colors.G300;

    const icon = (
      <EditorIconWrapper color={iconColor}>
        <DecisionIcon label="Decision" size="large" />
      </EditorIconWrapper>
    );

    const endAdornments = [
      <ReminderAdornment onReminderSet={this.handleReminderSet} />,
      <ParticipantsAdornment
        key="participant"
        appearance={appearance}
        participants={participants}
      />,
    ];

    return (
      <Item
        startAdornment={icon}
        appearance={appearance}
        contentRef={contentRef}
        endAdornment={endAdornments}
        placeholder={
          showPlaceholder
            ? "Type your action, use '@' to assign to someone."
            : undefined
        }
        helperText={this.getAttributionText()}
      >
        {children}
      </Item>
    );
  }
}
