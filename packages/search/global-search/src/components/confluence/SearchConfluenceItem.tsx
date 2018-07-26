import * as React from 'react';
import { searchConfluenceItem } from '../SearchResultsUtil';
import SearchIcon from '../../../../../core/icon/glyph/search';

export interface Props {
  query: string;
  text: JSX.Element;
}

export default class SearchConfluenceItem extends React.Component<Props> {
  render() {
    const { query, text } = this.props;

    return searchConfluenceItem({
      query: query,
      icon: <SearchIcon size="medium" label="Advanced search" />,
      text: text,
      showKeyboardLozenge: true,
    });
  }
}
