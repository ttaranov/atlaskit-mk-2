import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import SearchIcon from '@atlaskit/icon/glyph/search';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import AdvancedSearchResult from '../AdvancedSearchResult';
import { AnalyticsType } from '../../model/Result';

export interface Props {
  query: string;
  showKeyboardLozenge?: boolean;
  showSearchIcon?: boolean;
}

export interface State {
  selectedItem: string;
}

const TextContainer = styled.div`
  padding: 8px;
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
      <DropdownItem onClick={() => this.setState({ selectedItem: item })}>
        {getItem(item)}
      </DropdownItem>
    ));

  render() {
    const { query, showKeyboardLozenge, showSearchIcon } = this.props;
    return (
      <AdvancedSearchResult
        href={`#${query}`}
        key="search_confluence"
        resultId="advanced-jira-search"
        text={
          <Container>
            <TextContainer>
              <FormattedMessage id="global-search.jira.advanced-search" />
            </TextContainer>
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
