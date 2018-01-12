/**
 * @jest-environment node
 * @see https://github.com/styled-components/jest-styled-components#styled-components--v2
 */
import * as React from 'react';
import { shallow } from 'enzyme';

import { Wrapper } from '../styled';

describe('Wrapper', () => {
  it('should render active element', () => {
    const element = shallow(<Wrapper isActive={true} />);
    expect(element).toMatchSnapshot();
  });

  it('should render inactive element', () => {
    const element = shallow(<Wrapper isActive={false} />);
    expect(element).toMatchSnapshot();
  });
});
