import * as React from 'react';
import { shallow } from 'enzyme';
import { URLEmbedCard } from '../..';
import { Iframe } from '../../styled';

describe('URLEmbedCard', () => {
  it('should render an iframe with src when a URL is provided', () => {
    const url = 'http://google.com/';
    const element = shallow(<URLEmbedCard url={url} />);
    expect(element.find(Iframe).prop('src')).toEqual(url);
  });
});
