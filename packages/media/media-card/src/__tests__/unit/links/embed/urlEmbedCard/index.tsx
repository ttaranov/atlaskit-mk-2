import * as React from 'react';
import { shallow } from 'enzyme';
import { URLEmbedCard } from '../../../../../links/embed/urlEmbedCard';
import { Iframe } from '../../../../../links/embed/urlEmbedCard/styled';

describe('URLEmbedCard', () => {
  it('should render an iframe with .. when a URL is provided', () => {
    const url = 'http://google.com/';
    const element = shallow(<URLEmbedCard url={url} />);
    expect(element.find(Iframe).prop('src')).toEqual(url);
  });
});
