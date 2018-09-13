import * as React from 'react';
import { ResultBase } from '@atlaskit/quick-search';
import { defineMessages } from 'react-intl';

import ShiftReturn from '../assets/ShiftReturn';
import ShiftReturnHighlighted from '../assets/ShiftReturnHighlighted';

// MY_STRING
const messages = defineMessages({
  caption: {
    id: 'umux.dialog.content.written-feedback-field.caption',
    defaultMessage: 'Tell us why you rate Jira this way?',
    description: '',
  },
});
console.log(messages);

export interface Props {
  href: string;
  resultId: string;
  text: string | JSX.Element;
  icon?: JSX.Element;
  type: string;
  isSelected?: boolean; // injected by quick-search
  showKeyboardLozenge?: boolean;
  analyticsData?: object;
}

export default class AdvancedSearchResult extends React.Component<Props> {
  static defaultProps = {
    isSelected: false,
    showKeyboardLozenge: false,
  };

  getElemAfter() {
    const { showKeyboardLozenge, isSelected } = this.props;
    if (!showKeyboardLozenge) {
      return null;
    }

    return isSelected ? <ShiftReturnHighlighted /> : <ShiftReturn />;
  }

  render() {
    const { showKeyboardLozenge, ...baseProps } = this.props;
    return <ResultBase {...baseProps} elemAfter={this.getElemAfter()} />;
  }
}
