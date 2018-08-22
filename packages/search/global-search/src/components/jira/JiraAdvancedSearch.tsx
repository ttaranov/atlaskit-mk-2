import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { gridSize, math } from '@atlaskit/theme';
import styled from 'styled-components';
import SearchIcon from '@atlaskit/icon/glyph/search';
import Button from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import AdvancedSearchResult from '../AdvancedSearchResult';
import { AnalyticsType } from '../../model/Result';
import {
  getJiraAdvancedSearchUrl,
  JiraEntityTypes,
  ADVANCED_JIRA_SEARCH_RESULT_ID,
} from '../SearchResultsUtil';

export interface Props {
  query: string;
  onAdvancedSearchChange?(entity: JiraEntityTypes): void;
  showKeyboardLozenge?: boolean;
  showSearchIcon?: boolean;
}

export interface State {
  selectedItem: JiraEntityTypes;
}

const TextContainer = styled.div`
  padding: ${gridSize()}px 0;
  margin-right: ${gridSize()}px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
`;

const StyledButton = styled(Button)`
  margin-right: ${math.divide(gridSize, 4)}px;
`;

const itemI18nKeySuffix = [
  JiraEntityTypes.Issues,
  JiraEntityTypes.People,
  JiraEntityTypes.Projects,
  JiraEntityTypes.Filters,
  JiraEntityTypes.Boards,
];

const getI18nItemName = i18nKeySuffix => (
  <FormattedMessage
    id={`global-search.jira.advanced-search-${i18nKeySuffix}`}
  />
);

export default class JiraAdvancedSearch extends React.Component<Props> {
  state = {
    selectedItem: JiraEntityTypes.Issues,
  };

  allowNavigationOnClick = false;
  static defaultProps = {
    showKeyboardLozenge: false,
    showSearchIcon: false,
  };

  renderDropdownItems = () =>
    itemI18nKeySuffix.map(item => (
      <DropdownItem
        onClick={() => {
          this.setState({ selectedItem: item });
        }}
        key={item}
      >
        {getI18nItemName(item)}
      </DropdownItem>
    ));

  render() {
    const { query, showKeyboardLozenge, showSearchIcon } = this.props;
    return (
      <AdvancedSearchResult
        href={getJiraAdvancedSearchUrl(this.state.selectedItem, query)}
        key="search_jira"
        resultId={ADVANCED_JIRA_SEARCH_RESULT_ID}
        text={
          <Container
            onClick={e => {
              // we need to cancel on click event on the dropdown to stop navigation
              if (!this.allowNavigationOnClick) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <TextContainer>
              <FormattedMessage id="global-search.jira.advanced-search" />
            </TextContainer>
            <StyledButton
              onClick={() => {
                this.allowNavigationOnClick = true;
              }}
            >
              {getI18nItemName(this.state.selectedItem)}
            </StyledButton>
            <DropdownMenu
              trigger=""
              triggerType="button"
              shouldFlip={false}
              position="right bottom"
            >
              <DropdownItemGroup>
                {this.renderDropdownItems()}
              </DropdownItemGroup>
            </DropdownMenu>
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
