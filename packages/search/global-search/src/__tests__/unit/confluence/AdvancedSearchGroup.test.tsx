import * as React from 'react';
import { shallow } from 'enzyme';
import AdvancedSearchGroup, {
  Props,
} from '../../../components/confluence/AdvancedSearchGroup';
import SearchConfluenceItem from '../../../components/SearchConfluenceItem';
import { FormattedMessage } from 'react-intl';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    query: '',
    ...partialProps,
  };

  return shallow(<AdvancedSearchGroup {...props} />);
}

it('should render advanced search text when no query is entered', () => {
  const wrapper = render({ query: '' });
  expect(wrapper.find(SearchConfluenceItem).prop('text')).toEqual(
    <FormattedMessage id="global-search.confluence.advanced-search" />,
  );
});

it('should render advanced search text when a query is entered', () => {
  const wrapper = render({ query: 'foo foo' });
  expect(wrapper.find(SearchConfluenceItem).prop('text')).toEqual(
    <FormattedMessage
      id="global-search.confluence.advanced-search-for"
      values={{ query: 'foo foo' }}
    />,
  );
});
