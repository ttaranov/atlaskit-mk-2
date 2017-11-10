import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import Tooltip from '@atlaskit/tooltip';
import ToolbarButton from '../../../src/ui/ToolbarButton';

const noop = () => {};

describe('@atlaskit/editor-core/ui/ToolbarButton', () => {
  it('should not render tooltip if title is not set', () => {
    const toolbarButtonElem = mount(<ToolbarButton
      onClick={noop}
      selected={false}
      disabled={false}
    />);

    expect(toolbarButtonElem.find(Tooltip)).to.have.length(0);
    toolbarButtonElem.unmount();
  });

  it('should render tooltip if title is set', () => {
    const toolbarButtonElem = mount(<ToolbarButton
      onClick={noop}
      selected={false}
      disabled={false}
      title="tooltip text"
    />);

    expect(toolbarButtonElem.find(Tooltip)).to.have.length(1);
    toolbarButtonElem.unmount();
  });

  // NOTE tested visually
  it.skip('should hide tooltip on click', () => {
    const toolbarButtonElem = mount(<ToolbarButton
      onClick={noop}
      selected={false}
      disabled={false}
      title="tooltip text"
    />);

    toolbarButtonElem.simulate('mouseover');
    toolbarButtonElem.simulate('click');

    const tooltip = toolbarButtonElem.find(Tooltip);

    expect(tooltip).to.have.length(0);
    toolbarButtonElem.unmount();
  });

  it('should not display tooltip if hideTooltip prop is passed in', () => {
    const toolbarButtonElem = mount(<ToolbarButton
      onClick={noop}
      selected={false}
      disabled={false}
      hideTooltip={true}
      title="tooltip text"
    />);

    toolbarButtonElem.simulate('mouseover');

    const tooltip = toolbarButtonElem.find(Tooltip);

    expect(tooltip).to.have.length(0);
    toolbarButtonElem.unmount();
  });

  it('should pass titlePosition to tooltip position', () => {
    const toolbarButtonElem = mount(<ToolbarButton
      onClick={noop}
      selected={false}
      disabled={false}
      title="tooltip text"
      titlePosition="left"
    />);

    const tooltip = toolbarButtonElem.find(Tooltip);
    tooltip.simulate('mouseover');
    expect(tooltip.prop('position')).to.equal('left');
    toolbarButtonElem.unmount();
  });
});
