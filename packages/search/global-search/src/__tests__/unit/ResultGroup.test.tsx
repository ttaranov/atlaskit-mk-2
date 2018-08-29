import * as React from 'react';
import { shallow } from 'enzyme';
import ResultGroup, { Props } from '../../components/ResultGroup';
import { makeConfluenceObjectResult } from './_test-util';
import ResultList from '../../components/ResultList';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    title: '',
    results: [],
    sectionIndex: 0,
    ...partialProps,
  };

  return shallow(<ResultGroup {...props} />);
}

it('should render nothing when there are no results', () => {
  const wrapper = render({ results: [] });
  expect(wrapper.find(ResultList).exists()).toBe(false);
});

it('should render a result list when there are  results', () => {
  const wrapper = render({ results: [makeConfluenceObjectResult()] });
  expect(wrapper.find(ResultList).exists()).toBe(true);
});
