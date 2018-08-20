import * as React from 'react';
import styled from 'styled-components';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import { FormattedMessage } from 'react-intl';
import SearchIcon from '@atlaskit/icon/glyph/search';
import NoResults from '../NoResults';
import AdvancedSearchResult from '../AdvancedSearchResult';
import { AnalyticsType } from '../../model/Result';
import { ResultItemGroup } from '@atlaskit/quick-search';

const AdvancedSearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export interface Props {
  query: string;
}

export interface State {
  selectedItem: string;
}

const items = ['issues', 'projects', 'boards', 'filters'];

const getItem = item => (
  <FormattedMessage id={`global-search.no-results.${item}`} />
);

export default class NoResultsState extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: 'issues',
    };
  }

  renderDropDownItems = () =>
    items.map(item => (
      <DropdownItem onClick={() => this.setState({ selectedItem: item })}>
        {getItem(item)}
      </DropdownItem>
    ));

  render() {
    const { query } = this.props;

    return (
      <>
        <NoResults
          key="no-results"
          title={<FormattedMessage id="global-search.jira.no-results-title" />}
          body={<FormattedMessage id="global-search.jira.no-results-body" />}
        />
        <ResultItemGroup title="" key="advanced-search">
          <AdvancedSearchContainer>
            <AdvancedSearchResult
              href={`#${query}`}
              key="search_confluence"
              resultId="advanced-jira-search"
              text={
                <FormattedMessage id="global-search.jira.advanced-search" />
              }
              icon={<SearchIcon size="medium" label="Advanced search" />}
              type={AnalyticsType.AdvancedSearchJira}
              showKeyboardLozenge={false}
            />
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
          </AdvancedSearchContainer>
        </ResultItemGroup>
      </>
    );
  }
}
