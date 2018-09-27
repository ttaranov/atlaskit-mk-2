import * as React from 'react';
import AdvancedSearchResult from './AdvancedSearchResult';
import {
  getConfluenceAdvancedSearchLink,
  ADVANCED_CONFLUENCE_SEARCH_RESULT_ID,
} from './SearchResultsUtil';
import { AnalyticsType } from '../model/Result';

export interface Props {
  query: string;
  text: JSX.Element | string;
  icon?: JSX.Element;
  showKeyboardLozenge?: boolean;
  analyticsData?: object;
  isCompact?: boolean;
}

export default class SearchConfluenceItem extends React.Component<Props> {
  static defaultProps = {
    showKeyboardLozenge: false,
  };

  render() {
    const {
      query,
      icon,
      text,
      showKeyboardLozenge,
      analyticsData,
      isCompact,
    } = this.props;

    return (
      <AdvancedSearchResult
        href={getConfluenceAdvancedSearchLink(query)}
        key="search_confluence"
        resultId={ADVANCED_CONFLUENCE_SEARCH_RESULT_ID}
        text={text}
        icon={icon}
        type={AnalyticsType.AdvancedSearchConfluence}
        showKeyboardLozenge={showKeyboardLozenge}
        analyticsData={analyticsData}
        isCompact={isCompact}
      />
    );
  }
}
