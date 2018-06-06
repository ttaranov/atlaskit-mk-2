import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Lozenge from '@atlaskit/lozenge';
import { ResolvedView } from '../../../src/inline/ResolvedView/index';
import { Icon } from '../../../src/inline/ResolvedView/styled';

describe('ResolvedView', () => {
  it('should render the text', () => {
    const element = mount(<ResolvedView text="some text content" />);
    expect(element.text()).toContain('some text content');
  });

  it('should render an icon when it is provided', () => {
    const element = shallow(
      <ResolvedView icon="some-link-to-icon" text="some text content" />,
    );

    expect(element.find(Icon)).toHaveLength(1);
    expect(element.find(Icon).props().src).toEqual('some-link-to-icon');
  });

  it('should render a lozenge when it is provided', () => {
    const lozenge = {
      text: 'some-lozenge-text',
      isBold: true,
      appearance: 'inprogress' as 'inprogress',
    };

    const element = shallow(
      <ResolvedView text="some text content" lozenge={lozenge} />,
    );
    expect(element.find(Lozenge)).toHaveLength(1);
    expect(element.find(Lozenge).prop('children')).toEqual('some-lozenge-text');
    expect(element.find(Lozenge).prop('appearance')).toEqual('inprogress');
    expect(element.find(Lozenge).prop('isBold')).toEqual(true);
  });
});
