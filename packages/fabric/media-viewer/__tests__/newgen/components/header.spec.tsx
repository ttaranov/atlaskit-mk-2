import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { Header } from '../../../src/newgen/components/header';

describe('<Header />', () => {
  it('should get the correct collection provider', () => {
    const item = {
      details: {
        name: 'test'
      }
    }
    const header = shallow(
      <Header item={item}/>,
    );
    expect(header.find('strong')).toHaveLength(1);
  });
});
