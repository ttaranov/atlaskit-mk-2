import * as React from 'react'; // eslint-disable-line
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { GenericButton } from '../../genericButton';
import { ButtonNormal, ButtonClicked, ButtonActive } from '../../styles';

describe('GenericButton', () => {
  const onClick = () => {};

  it('should display normal button by default', () => {
    const genericButton = shallow(<GenericButton onClick={onClick} />);
    expect(genericButton.find(ButtonNormal)).to.have.length(1);
  });

  it('should display active button if isActive set', () => {
    const genericButton = shallow(
      <GenericButton isActive={true} onClick={onClick} />,
    );
    expect(genericButton.find(ButtonActive)).to.have.length(1);
  });

  it('should have clicked state on mousedown-mouseup and left button', () => {
    const genericButton = shallow(<GenericButton onClick={onClick} />);
    expect(genericButton.find(ButtonNormal)).to.have.length(1);

    genericButton.simulate('mousedown', { button: 0 });
    expect(genericButton.find(ButtonClicked)).to.have.length(1);

    genericButton.simulate('mouseup', { button: 0 });
    expect(genericButton.find(ButtonNormal)).to.have.length(1);
  });

  it('should have clicked state on mousedown-mouseleave and left button', () => {
    const genericButton = shallow(<GenericButton onClick={onClick} />);
    expect(genericButton.find(ButtonNormal)).to.have.length(1);

    genericButton.simulate('mousedown', { button: 0 });
    expect(genericButton.find(ButtonClicked)).to.have.length(1);

    genericButton.simulate('mouseleave', { button: 0 });
    expect(genericButton.find(ButtonNormal)).to.have.length(1);
  });

  it('should not have clicked state on mousedown-mouseup and right button', () => {
    const genericButton = shallow(<GenericButton onClick={onClick} />);
    expect(genericButton.find(ButtonNormal)).to.have.length(1);

    genericButton.simulate('mousedown', { button: 1 });
    expect(genericButton.find(ButtonNormal)).to.have.length(1);

    genericButton.simulate('mouseup', { button: 1 });
    expect(genericButton.find(ButtonNormal)).to.have.length(1);
  });
});
