import * as React from 'react';
import { ResultBase } from '@atlaskit/quick-search';

import ShiftReturn from '../assets/ShiftReturn';
import ShiftReturnHighlighted from '../assets/ShiftReturnHighlighted';

export interface Props {
  href: string;
  resultId: string;
  text: string | JSX.Element;
  icon?: JSX.Element;
  type: string;
  isSelected?: boolean; // injected by quick-search
  showKeyboardLozenge?: boolean;
  target?: string;
  analyticsData?: object;
  isCompact?: boolean;
}

export default class AdvancedSearchResult extends React.Component<Props> {
  static defaultProps = {
    isSelected: false,
    isCompact: false,
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
