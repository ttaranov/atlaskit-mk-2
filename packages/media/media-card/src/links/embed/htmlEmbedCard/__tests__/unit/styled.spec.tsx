import * as React from 'react';
import { shallow } from 'enzyme';
import { Iframe } from '../../styled';

describe('Iframe', () => {
  it('should be hidden when loading', () => {
    const tree = shallow(<Iframe isLoading={true} />);
    expect(tree).toHaveStyleRule('visibility', 'hidden');
    expect(tree).toMatchSnapshot();
  });

  it('should be visible when loaded', () => {
    const tree = shallow(<Iframe isLoading={false} />);
    expect(tree).not.toHaveStyleRule('visibility', 'hidden');
    expect(tree).toMatchSnapshot();
  });
});
