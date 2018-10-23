import * as React from 'react';
import Avatar from '@atlaskit/avatar';

import ResultBase from './ResultBase';

import { PersonResultType as Props } from './types';

const PERSON_RESULT_TYPE = 'person';

// ===================================================================
// If adding a prop or feature that may be useful to all result types,
// add it to ResultBase instead
// ===================================================================

export default class PersonResult extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    mentionPrefix: '@',
    presenceState: null, // No presence indicator by default
    type: PERSON_RESULT_TYPE,
  };

  getMention = () =>
    this.props.mentionName
      ? `${this.props.mentionPrefix}${this.props.mentionName}`
      : undefined;

  getAvatar = () => {
    if (this.props.avatar) {
      return this.props.avatar;
    }

    return (
      <Avatar
        presence={this.props.presenceState}
        size="small"
        src={this.props.avatarUrl}
      />
    );
  };

  render() {
    const { name, presenceMessage, ...resultBaseProps } = this.props;
    return (
      <ResultBase
        {...resultBaseProps}
        caption={this.getMention()}
        icon={this.getAvatar()}
        subText={presenceMessage}
        text={name}
      />
    );
  }
}
