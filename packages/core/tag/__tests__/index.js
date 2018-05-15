// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';
import styled from 'styled-components';

import Chrome from '../src/Chrome';
import Content from '../src/Content';
import Remove from '../src/RemoveButton';
import Tag from '../src/Tag';

import Before from '../src/Tag/styledBefore';
import Container from '../src/Tag/styledContainer';
import { Link, Text } from '../src/Content/styled';

describe('Tag component', () => {
  const atlassianHref = 'https://www.atlassian.com';
  const atlassianText = 'Atlassian';
  const bitbucketHref = 'https://bitbucket.org';
  const testProps = {
    text: atlassianText,
    href: atlassianHref,
    removeButtonText: 'Click to remove this tag!',
  };

  it('Test Tag with removable link', () => {
    const wrapper = mount(<Tag {...testProps} />);
    expect(wrapper.prop('href')).toBe(atlassianHref);
    expect(wrapper.find('a').text()).toBe(atlassianText);
    expect(wrapper.find(Chrome).prop('isRemovable')).toBe(true);
  });

  it('onBeforeRemoveAction callback contract', () => {
    const onBeforeRemoveAction = jest.fn();
    const wrapper = mount(
      <Tag
        text="tag"
        removeButtonText="Remove"
        onBeforeRemoveAction={onBeforeRemoveAction}
      />,
    );
    wrapper.find(Remove).simulate('click');
    expect(onBeforeRemoveAction).toHaveBeenCalledTimes(1);
  });

  it('onAfterRemoveAction callback contract', () => {
    const onAfterRemoveAction = jest.fn();
    const wrapper = mount(
      <Tag
        text="tag"
        removeButtonText="Remove"
        onAfterRemoveAction={onAfterRemoveAction}
      />,
    );
    wrapper.find(Remove).simulate('click');
    wrapper.find(Container).simulate('animationEnd');
    expect(onAfterRemoveAction).toHaveBeenCalledTimes(1);
  });

  it('onAfterRemoveAction should not be called if onBeforeRemoveAction returns false', () => {
    const onAfterRemoveAction = jest.fn();
    const wrapper = mount(
      <Tag
        text="tag"
        removeButtonText="Remove"
        onBeforeRemoveAction={() => false}
        onAfterRemoveAction={onAfterRemoveAction}
      />,
    );
    wrapper.find(Remove).simulate('click');
    expect(onAfterRemoveAction).not.toHaveBeenCalled();
  });

  it('set markedForRemoval via mouse events on remove button', () => {
    const wrapper = mount(<Tag removeButtonText="Remove" text="tag" />);
    wrapper.find(Remove).simulate('mouseover');
    expect(wrapper.find(Chrome).prop('markedForRemoval')).toBe(true);
    wrapper.find(Remove).simulate('mouseout');
    expect(wrapper.find(Chrome).prop('markedForRemoval')).toBe(false);
  });

  it('remove via keypress on remove button', () => {
    const wrapper = mount(<Tag text="tag" removeButtonText="foo" />);
    wrapper.find(Remove).simulate('keypress', { key: ' ' });
    wrapper.find(Remove).simulate('keypress', { key: 'Enter' });
    expect(wrapper.state('isRemoving')).toBe(true);
  });

  it('Tag allows us to set props', () => {
    const wrapper = mount(<Tag text={atlassianText} href={atlassianHref} />);
    expect(wrapper.prop('href')).toBe(atlassianHref);

    expect(wrapper.find('a').text()).toBe(atlassianText);

    wrapper.setProps({ href: bitbucketHref });
    expect(wrapper.prop('href')).toBe(bitbucketHref);
  });

  describe('appearance prop', () => {
    it('should set the isRounded prop of Chrome and Remove to true when set to "rounded"', () => {
      const wrapper = mount(
        <Tag appearance="rounded" text="foo" removeButtonText="foo" />,
      );
      expect(wrapper.find(Chrome).prop('isRounded')).toBe(true);
      expect(wrapper.find(Remove).prop('isRounded')).toBe(true);
    });

    it('should set the isRounded prop of Chrome and Remove to false when not set to "rounded"', () => {
      const wrapper = mount(
        <Tag appearance="default" text="foo" removeButtonText="foo" />,
      );
      expect(wrapper.find(Chrome).prop('isRounded')).toBe(false);
      expect(wrapper.find(Remove).prop('isRounded')).toBe(false);
    });
  });

  describe('elemBefore prop', () => {
    it('should render anything passed to it', () => {
      const wrapper = mount(
        <Tag text="foo" elemBefore={<div className="test" />} />,
      );
      expect(wrapper.find(Before).find('div.test').length).toBe(1);
    });

    it('should render the elemBefore before the content', () => {
      const wrapper = shallow(
        <Tag text="foo" elemBefore={<div className="test" />} />,
      );
      const chrome = wrapper.find(Chrome);
      expect(chrome.childAt(0).is(Before)).toBe(true);
      expect(chrome.childAt(1).is(Content)).toBe(true);
    });
  });

  describe('text prop', () => {
    it('should render text to a Content block', () => {
      const wrapper = mount(<Tag text="foo" />);
      expect(wrapper.find(Content).text()).toBe('foo');
    });
  });

  describe('href prop', () => {
    it('should cause an anchor to be rendered', () => {
      const wrapper = mount(<Tag text="foo" href="#" />);
      expect(wrapper.find(Content).find('a').length).toBe(1);
    });

    it('should reflect the href onto the anchor', () => {
      const wrapper = mount(<Tag text="foo" href="#" />);
      expect(
        wrapper
          .find(Content)
          .find('a')
          .prop('href'),
      ).toBe('#');
    });

    it('should set the isLink prop on Chrome', () => {
      const wrapper = mount(<Tag text="foo" href="#" />);
      expect(wrapper.find(Chrome).prop('isLink')).toBe(true);
    });
  });

  describe('removeButtonText prop', () => {
    it('should not render a button if not set', () => {
      const wrapper = mount(<Tag text="foo" />);
      expect(wrapper.find(Remove).length).toBe(0);
    });

    it('should render a button if set', () => {
      const wrapper = mount(<Tag text="foo" removeButtonText="removeMe" />);
      expect(wrapper.find(Remove).length).toBe(1);
    });

    it('should set the removeText prop of button if set', () => {
      const wrapper = mount(<Tag text="foo" removeButtonText="removeMe" />);
      expect(wrapper.find(Remove).prop('removeText')).toBe('removeMe');
    });
  });

  describe('onBeforeRemoveAction prop', () => {
    it('should be called if button is clicked', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <Tag
          text="foo"
          removeButtonText="removeMe"
          onBeforeRemoveAction={spy}
        />,
      );
      wrapper.find('button').simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('linkComponent prop', () => {
    it('should default to our link component', () => {
      const wrapper = mount(<Tag text="foo" href="/something" />);
      expect(wrapper.find(Link).length).toBe(1);
    });
    it('should default to our Text component when there is no href and a linkComponent', () => {
      const wrapper = mount(<Tag text="foo" linkComponent={styled.a``} />);
      expect(wrapper.find(Text).length).toBe(1);
    });
    it('should use our linkComponent when there is a href', () => {
      const A = styled.a``;
      const wrapper = mount(
        <Tag text="foo" href="/something" linkComponent={A} />,
      );
      expect(wrapper.find(Link).length).toBe(0);
      expect(wrapper.find(A).length).toBe(1);
    });
  });

  describe('onAfterRemoveAction prop', () => {
    it('should be called after remove animation is completed', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <Tag
          text="foo"
          removeButtonText="removeMe"
          onAfterRemoveAction={spy}
        />,
      );
      wrapper.find('button').simulate('click');
      wrapper.find(Container).simulate('animationEnd');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not be called if onBeforeRemoveAction returns false', () => {
      const beforeRemove = () => false;
      const spy = jest.fn();
      const wrapper = mount(
        <Tag
          text="foo"
          removeButtonText="removeMe"
          onBeforeRemoveAction={beforeRemove}
          onAfterRemoveAction={spy}
        />,
      );
      wrapper.find('button').simulate('click');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('color prop', () => {
    it('should render with a color option', () => {
      const wrapper = mount(<Tag text="default" color="purple" />);
      expect(wrapper.props().color).toBe('purple');
    });

    it('should render the standard color option if no color option is provided', () => {
      const wrapper = mount(<Tag text="default" />);
      expect(wrapper.props().color).toBe('standard');
    });

    it('should render the standard color option if missing color option is provided', () => {
      // $FlowFixMe
      const wrapper = mount(<Tag text="gibberish" color="gibberish" />);
      expect(wrapper.find(Chrome).props().color).toBe('standard');
    });
  });
});
