import * as React from 'react';
import { shallow } from 'enzyme';
import { URLEmbedCard } from '../../../../src/links/embed/urlEmbedCard';
import { Iframe } from '../../../../src/links/embed/urlEmbedCard/styled';

describe('URLEmbedCard', () => {
  it('should render an iframe with src when a URL is provided', () => {
    const url = 'http://google.com/';
    const element = shallow(<URLEmbedCard url={url} />);
    expect(element.find(Iframe).prop('src')).toEqual(url);
  });
});
