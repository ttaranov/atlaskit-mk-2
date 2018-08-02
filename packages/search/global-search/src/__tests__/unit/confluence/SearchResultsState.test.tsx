import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import SearchResultsState, {
  Props,
} from '../../../components/confluence/SearchResultsState';
import {
  makeConfluenceObjectResult,
  makeConfluenceContainerResult,
  makePersonResult,
} from '../_test-util';
import { mountWithIntl } from '../helpers/_intl-enzyme-test-helper';
import { Props as ResultGroupProps } from '../../../components/ResultGroup';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    query: '',
    objectResults: [],
    spaceResults: [],
    peopleResults: [],
    searchSessionId: '0',
    ...partialProps,
  };

  return shallow(<SearchResultsState {...props} />);
}

function renderMount(partialProps: Partial<Props>) {
  const props: Props = {
    query: '',
    objectResults: [],
    spaceResults: [],
    peopleResults: [],
    searchSessionId: '0',
    ...partialProps,
  };

  return mountWithIntl(<SearchResultsState {...props} />);
}

function findGroup(
  wrapper: ShallowWrapper,
  key: string,
): ShallowWrapper<ResultGroupProps> {
  return wrapper.findWhere(n => n.key() === key);
}

it('should render objects', () => {
  const wrapper = render({
    objectResults: [makeConfluenceObjectResult()],
  });

  expect(findGroup(wrapper, 'objects').prop('results')).toHaveLength(1);
});

it('should render spaces', () => {
  const wrapper = render({
    spaceResults: [makeConfluenceContainerResult()],
  });

  expect(findGroup(wrapper, 'spaces').prop('results')).toHaveLength(1);
});

it('should render people', () => {
  const wrapper = render({
    peopleResults: [makePersonResult()],
  });

  expect(findGroup(wrapper, 'people').prop('results')).toHaveLength(1);
});

it('should fire post query screen event', () => {
  const screenCounter = {
    name: 'postQueryScreenCounter',
    increment: jest.fn(),
    getCount: jest.fn(() => 101),
  };

  renderMount({
    objectResults: [makeConfluenceObjectResult()],
    screenCounter: screenCounter,
  });

  expect(screenCounter.increment.mock.calls.length).toBe(1);
  expect(screenCounter.getCount.mock.calls.length).toBe(1);
});

describe('sectionIndex', () => {
  it('should increment properly', () => {
    const wrapper = render({
      objectResults: [makeConfluenceObjectResult()],
      spaceResults: [makeConfluenceContainerResult()],
      peopleResults: [makePersonResult()],
    });

    expect(findGroup(wrapper, 'objects').prop('sectionIndex')).toBe(0);
    expect(findGroup(wrapper, 'spaces').prop('sectionIndex')).toBe(1);
    expect(findGroup(wrapper, 'people').prop('sectionIndex')).toBe(2);
  });

  it('should increment properly when groups are empty', () => {
    const wrapper = render({
      objectResults: [],
      spaceResults: [],
      peopleResults: [makePersonResult()],
    });

    expect(findGroup(wrapper, 'people').prop('sectionIndex')).toBe(0);
  });
});
