import * as React from 'react';
import { shallow } from 'enzyme';
import { Status } from '../../';
import Lozenge from '@atlaskit/lozenge';

describe('Status', () => {
  it('should render', () => {
    const component = shallow(<Status text="In progress" color="blue" />);

    expect(component.find(Lozenge).length).toBe(1);
  });

  it('should have max-width 200px', () => {
    const component = shallow(<Status text="In progress" color="blue" />);

    expect(component.find(Lozenge).prop('maxWidth')).toBe(200);
  });

  it('should map colors to lozenge appearances', () => {
    const colorToLozengeAppearanceMap = {
      neutral: 'default',
      purple: 'new',
      blue: 'inprogress',
      red: 'removed',
      yellow: 'moved',
      green: 'success',
    };

    function checkColorMapping(color, appearance) {
      const component = shallow(<Status text="In progress" color={color} />);
      expect(component.find(Lozenge).prop('appearance')).toBe(appearance);
    }

    for (let color in colorToLozengeAppearanceMap) {
      checkColorMapping(color, colorToLozengeAppearanceMap[color]);
    }
  });

  it('should use default color if color is unknown', () => {
    // @ts-ignore: passing an invalid color
    const component = shallow(<Status text="In progress" color="unknown" />);

    expect(component.find(Lozenge).prop('appearance')).toBe('default');
  });

  it('should not render it if text is empty', () => {
    const component = shallow(<Status text=" " color="blue" />);

    expect(component.find(Lozenge).length).toBe(0);
  });
});
