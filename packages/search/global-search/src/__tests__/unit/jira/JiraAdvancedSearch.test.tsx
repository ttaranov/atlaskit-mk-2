import * as React from 'react';
import { shallow } from 'enzyme';
import JiraAdvancedSearch, {
  Props,
} from '../../../components/jira/JiraAdvancedSearch';
import AdvancedSearchResult from '../../../components/AdvancedSearchResult';
import * as Utils from '../../../components/SearchResultsUtil';
import { AnalyticsType } from '../../../model/Result';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';

const defaultProps: Props = {
  query: 'query',
};

const renderComponent = (overriddenProps?: Partial<Props>) => {
  const props = { ...defaultProps, ...overriddenProps };
  return shallow(<JiraAdvancedSearch {...props} />);
};

describe('JiraAdvancedSearch', () => {
  let getJiraAdvancedSearchUrlMock;
  beforeEach(() => {
    getJiraAdvancedSearchUrlMock = jest.spyOn(
      Utils,
      'getJiraAdvancedSearchUrl',
    );
    getJiraAdvancedSearchUrlMock.mockReturnValue('advancedSearchUrl');
  });

  afterEach(() => {
    getJiraAdvancedSearchUrlMock.mockReset();
  });

  it('should default to issues search', () => {
    const wrapper = renderComponent();
    const advancedSearchResult = wrapper.find(AdvancedSearchResult);

    expect(advancedSearchResult.length).toBe(1);
    expect(advancedSearchResult.props()).toMatchObject({
      href: 'advancedSearchUrl',
      icon: undefined,
      type: AnalyticsType.AdvancedSearchJira,
      showKeyboardLozenge: false,
    });
    expect(getJiraAdvancedSearchUrlMock).toHaveBeenCalledTimes(1);
    expect(getJiraAdvancedSearchUrlMock).toHaveBeenLastCalledWith(
      'issues',
      'query',
    );
  });

  it('should render icon and showKeyboardLonzge', () => {
    const wrapper = renderComponent({
      showSearchIcon: true,
      showKeyboardLozenge: true,
    });
    const advancedSearchResult = wrapper.find(AdvancedSearchResult);
    expect(advancedSearchResult.length).toBe(1);
    expect(advancedSearchResult.props().showKeyboardLozenge).toBe(true);

    const icon = advancedSearchResult.props().icon;
    expect(icon).toBeDefined();
  });

  it('should render dropdown items with possible choices', () => {
    const wrapper = renderComponent({
      showSearchIcon: true,
      showKeyboardLozenge: true,
    });
    const advancedSearchResult = wrapper.find(AdvancedSearchResult);

    const dropDownMenu = shallow(advancedSearchResult.props()
      .text as JSX.Element).find(DropdownMenu);
    expect(dropDownMenu.length).toBe(1);

    const items = dropDownMenu.find(DropdownItem);
    expect(items.length).toBe(4);
    expect(items.map(item => item.key())).toMatchObject([
      'people',
      'projects',
      'filters',
      'boards',
    ]);
  });

  it('should update advanced search url', async () => {
    const wrapper = renderComponent({
      showSearchIcon: true,
      showKeyboardLozenge: true,
    });
    let advancedSearchResult = wrapper.find(AdvancedSearchResult);

    // defualt to issues
    expect(getJiraAdvancedSearchUrlMock).toHaveBeenCalledTimes(1);
    expect(getJiraAdvancedSearchUrlMock).toHaveBeenLastCalledWith(
      'issues',
      'query',
    );

    getJiraAdvancedSearchUrlMock.mockReturnValue('projectsSearchUrl');

    const dropDownMenu = shallow(advancedSearchResult.props()
      .text as JSX.Element).find(DropdownMenu);

    const projectsItem = dropDownMenu.findWhere(
      item =>
        item.is(DropdownItem) && item.key().toLocaleLowerCase() === 'projects',
    );

    projectsItem.props().onClick();
    await wrapper.update();
    advancedSearchResult = wrapper.find(AdvancedSearchResult);

    expect(getJiraAdvancedSearchUrlMock).toHaveBeenLastCalledWith(
      'projects',
      'query',
    );
    expect(getJiraAdvancedSearchUrlMock).toHaveBeenCalledTimes(2);
    expect(advancedSearchResult.props().href).toBe('projectsSearchUrl');
  });
});
