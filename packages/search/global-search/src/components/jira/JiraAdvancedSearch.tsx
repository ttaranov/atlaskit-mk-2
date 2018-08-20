import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { gridSize } from '@atlaskit/theme';
import styled from 'styled-components';
import SearchIcon from '@atlaskit/icon/glyph/search';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import AdvancedSearchResult from '../AdvancedSearchResult';
import { AnalyticsType } from '../../model/Result';
import { getJiraAdvancedSearchUrl } from '../SearchResultsUtil';

export interface Props {
  query: string;
  showKeyboardLozenge?: boolean;
  showSearchIcon?: boolean;
}

export interface State {
  selectedItem: string;
}

const TextContainer = styled.div`
  padding: ${gridSize}px 0;
  margin-right: ${gridSize}px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
`;
const items = ['issues', 'projects', 'boards', 'filters'];

const getItem = item => (
  <FormattedMessage id={`global-search.no-results.${item}`} />
);

export default class JiraAdvancedSearch extends React.Component<Props> {
  state = {
    selectedItem: 'issues',
  };

  static defaultProps = {
    showKeyboardLozenge: false,
    showSearchIcon: false,
  };

  renderDropDownItems = () =>
    items.map(item => (
      <DropdownItem
        onClick={() => {
          this.setState({ selectedItem: item });
        }}
        key={item}
      >
        {getItem(item)}
      </DropdownItem>
    ));

  render() {
    const { query, showKeyboardLozenge, showSearchIcon } = this.props;
    return (
      <AdvancedSearchResult
        href={getJiraAdvancedSearchUrl(this.state.selectedItem, query)}
        key="search_jira"
        resultId="advanced-jira-search"
        text={
          <Container>
            <TextContainer>
              <FormattedMessage id="global-search.jira.advanced-search" />
            </TextContainer>
            <div
              onClick={e => {
                // we need to cancel on click event on the dropdown to stop navigation
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <DropdownMenu
                trigger={getItem(this.state.selectedItem)}
                triggerType="button"
                shouldFlip={false}
                position="right bottom"
              >
                <DropdownItemGroup>
                  {this.renderDropDownItems()}
                </DropdownItemGroup>
              </DropdownMenu>
            </div>
          </Container>
        }
        icon={
          showSearchIcon ? (
            <SearchIcon size="medium" label="Advanced search" />
          ) : (
            undefined
          )
        }
        type={AnalyticsType.AdvancedSearchJira}
        showKeyboardLozenge={showKeyboardLozenge}
      />
    );
  }
}
