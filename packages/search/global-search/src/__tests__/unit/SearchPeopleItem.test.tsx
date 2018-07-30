import * as React from 'react';
import { shallow } from 'enzyme';
import SearchPeopleItem, { Props } from '../../components/SearchPeopleItem';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    query: 'query',
    icon: <div />,
    text: 'text',
    ...partialProps,
  };

  return shallow(<SearchPeopleItem {...props} />);
}

it('should render the text', () => {
  const wrapper = render({ text: 'cucumber' });
  expect(wrapper.prop('text')).toEqual('cucumber');
});

it('should render the icon', () => {
  const wrapper = render({ icon: <span /> });
  expect(wrapper.prop('icon')).toEqual(<span />);
});

it('should append the url encoded query', () => {
  const wrapper = render({ query: 'test query' });
  expect(wrapper.prop('href')).toEqual('/people/search?q=test%20query');
});
