import * as React from 'react';
import AdvancedSearchResult from './AdvancedSearchResult';
import {
  getConfluenceAdvancedSearchLink,
  ADVANCED_CONFLUENCE_SEARCH_RESULT_ID,
} from './SearchResultsUtil';
import { AnalyticsType } from '../model/Result';

export interface Props {
  query: string;
  icon: JSX.Element;
  text: JSX.Element | string;
  showKeyboardLozenge?: boolean;
  analyticsData?: object;
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
      />
    );
  }
}
