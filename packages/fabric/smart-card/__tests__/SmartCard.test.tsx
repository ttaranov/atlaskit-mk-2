import * as React from 'react';
import { shallow } from 'enzyme';
import SmartCardView from '../src/SmartCardView';
import SmartCard from '../src/SmartCard';

declare namespace NodeJS {
  interface Global {
    fetch: Function;
  }
}

function createFetchWithNoResponse() {
  const res = new Promise(() => {
    /* never resolve */
  });
  return jest.fn().mockReturnValue(res);
}

function createFetchWithErrorResponse() {
  const res = Promise.reject(new Error('Oops.'));
  return jest.fn().mockReturnValue(res);
}

function createFetchWithOKResponse() {
  const json = Promise.resolve({ data: {} });
  const res = Promise.resolve({ json: () => json });
  return jest.fn().mockReturnValue(res);
}

describe('SmartCard', () => {
  it('should render null when loading', () => {
    global.fetch = createFetchWithNoResponse();
    const wrapper = shallow(<SmartCard url="https://www.atlassian.com/" />);
    expect(wrapper.equals(null)).toBeTruthy();
  });

  it('should render null when errored', async () => {
    global.fetch = createFetchWithErrorResponse();
    const wrapper = shallow(<SmartCard url="https://www.atlassian.com/" />);

    try {
      // wait for the data to be loaded
      await fetch('https://www.atlassian.com/');
    } catch (error) {
      wrapper.update();
      expect(wrapper.equals(null)).toBeTruthy();
    }
  });

  it('should render the card when loaded', async () => {
    global.fetch = createFetchWithOKResponse();
    const wrapper = shallow(<SmartCard url="https://www.atlassian.com/" />);

    // wait for the data to be loaded
    const res = await fetch('https://www.atlassian.com/');
    const json = await res.json();

    wrapper.update();
    expect(wrapper.find(SmartCardView)).toHaveLength(1);
  });

  it('should reload the data when changed', async () => {
    global.fetch = createFetchWithOKResponse();
    const wrapper = shallow(<SmartCard url="https://www.atlassian.com/" />);

    // wait for the data to be loaded
    const res1 = await fetch('https://www.atlassian.com/');
    const json1 = await res1.json();

    wrapper.update();
    expect(wrapper.find(SmartCardView)).toHaveLength(1);

    // update the URL
    global.fetch = createFetchWithOKResponse();
    wrapper.setProps({ url: 'https://www.google.com/' });

    // expect it to have started loading again
    wrapper.update();
    expect(wrapper.equals(null)).toBeTruthy();

    // wait for the data to be loaded
    const res2 = await fetch('https://www.atlassian.com/');
    const json2 = await res2.json();

    // expect it to have finished loading again
    wrapper.update();
    expect(wrapper.find(SmartCardView)).toHaveLength(1);
  });
});
