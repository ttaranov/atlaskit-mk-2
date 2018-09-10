// mocks aren't being automatically hoisted so I had to put this here
jest.mock('uuid/v1', () => {
  return jest.fn(() => 'abc-123');
});

import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { HTMLEmbedCard } from '../..';
import { Iframe } from '../../styled';

describe('HTMLEmbedCard', () => {
  it('should render isLoading=true when the iframe is loading', () => {
    const html = '<h1>Hello World!</h1>';
    const element = shallow(<HTMLEmbedCard html={html} />);
    expect(element.find(Iframe).prop('isLoading')).toBeTruthy();
  });

  it('should render isLoading=false when the HTML has been injected and the size has changed', () => {
    const html = '<h1>Hello World!</h1>';
    const element = mount(<HTMLEmbedCard html={html} />);

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'embed:resize',
          id: 'abc-123',
          width: 123,
          height: 456,
        },
      }),
    );
    element.update();

    expect(element.find(Iframe).prop('isLoading')).toBeFalsy();
  });

  it('should post the HTML to iframe when the iframe has loaded', () => {
    const html = '<h1>Hello World!</h1>';
    const element = mount(<HTMLEmbedCard html={html} />);

    // mock the postMessage() fn
    const iframe = element.find('iframe').getDOMNode() as HTMLIFrameElement;
    Object.defineProperty(iframe, 'contentWindow', {
      value: {
        postMessage: jest.fn(),
      },
    });

    element.find(Iframe).simulate('load');
    expect(iframe.contentWindow!.postMessage).toBeCalledWith(
      {
        type: 'embed',
        id: 'abc-123',
        html,
      },
      '*',
    );
  });

  it('should not render width+height when width+height are undefined', () => {
    const html = '<h1>Hello World!</h1>';
    const element = shallow(<HTMLEmbedCard html={html} />);
    expect(element.find(Iframe).prop('style')).toMatchObject({
      width: '',
      height: '',
    });
  });

  it('should render width+height when the width+height are sent by the iframe', () => {
    const html = '<h1>Hello World!</h1>';
    const element = mount(<HTMLEmbedCard html={html} />);

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'embed:resize',
          id: 'abc-123',
          width: 123,
          height: 456,
        },
      }),
    );
    element.update();

    expect(element.find(Iframe).prop('style')).toMatchObject({
      width: '123px',
      height: '456px',
    });
  });
});
