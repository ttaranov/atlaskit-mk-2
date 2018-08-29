import * as React from 'react';
import { shallow } from 'enzyme';
import SearchJiraItem, { Props } from '../../components/SearchJiraItem';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    query: 'query',
    ...partialProps,
  };

  return shallow(<SearchJiraItem {...props} />);
}

it('should append the url encoded query', () => {
  const wrapper = render({ query: 'test query' });
  expect(wrapper.prop('href')).toEqual(
    '/issues/?jql=text%20~%20%22test%20query%22',
  );
});
