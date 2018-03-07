// @flow
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import ReactDOM from 'react-dom';
import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';

import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import BreadcrumbsItemWithAnalytics, {
  BreadcrumbsItem,
} from '../src/components/BreadcrumbsItem';

export const setItemWidth = (item: BreadcrumbsItem, width: number) => {
  // eslint-disable-line import/prefer-default-export
  const buttonEl = ReactDOM.findDOMNode(item.button); // eslint-disable-line react/no-find-dom-node
  if (!buttonEl || !(buttonEl instanceof HTMLElement)) {
    throw new Error('could not find button element');
  }
  Object.defineProperty(buttonEl, 'clientWidth', { value: width });
};

describe('BreadcrumbsItem', () => {
  describe('exports', () => {
    it('the BreadcrumbsItem component', () => {
      expect(BreadcrumbsItem).not.toBe(undefined);
      expect(new BreadcrumbsItem()).toBeInstanceOf(Component);
    });
  });

  describe('construction', () => {
    it('should be able to create a component', () => {
      const wrapper = shallow(<BreadcrumbsItem text="arbitrary" />);
      expect(wrapper).not.toBe(undefined);
      expect(wrapper.instance()).toBeInstanceOf(Component);
    });

    it('should set the initial state correctly', () => {
      const wrapper = shallow(<BreadcrumbsItem text="arbitrary" />);
      expect(wrapper.state().hasOverflow).toBe(false);
    });

    it('should render a link Button containing the content', () => {
      const text = 'text';
      const wrapper = mount(<BreadcrumbsItem text={text} />);
      expect(wrapper.find(Button).text()).toBe(text);
    });
  });

  describe('props', () => {
    describe('item prop', () => {
      it('should be reflected to the Button content', () => {
        const text = 'text';
        const wrapper = mount(<BreadcrumbsItem text={text} />);
        expect(wrapper.find(Button).text()).toBe(text);
      });
    });
    describe('href prop', () => {
      it('should be reflected to the Button', () => {
        const href = '/my/href/';
        const wrapper = mount(<BreadcrumbsItem href={href} text="arbitrary" />);
        expect(wrapper.find(Button).prop('href')).toBe(href);
      });
    });
    describe('iconAfter prop', () => {
      it('should be reflected to the Button', () => {
        const icon = <AtlassianIcon label="icon" />;
        const wrapper = mount(
          <BreadcrumbsItem iconAfter={icon} text="arbitrary" />,
        );
        expect(wrapper.find(Button).prop('iconAfter')).toBe(icon);
      });
    });
    describe('iconBefore prop', () => {
      it('should be reflected to the Button', () => {
        const icon = <AtlassianIcon label="icon" />;
        const wrapper = mount(
          <BreadcrumbsItem iconBefore={icon} text="arbitrary" />,
        );
        expect(wrapper.find(Button).prop('iconBefore')).toBe(icon);
      });
    });
    describe('target prop', () => {
      it('should be reflected to the Button', () => {
        const target = '_top';
        const wrapper = mount(
          <BreadcrumbsItem target={target} text="arbitrary" />,
        );
        expect(wrapper.find(Button).prop('target')).toBe(target);
      });
    });
    describe('onClick prop', () => {
      it('should be reflected to the Button', () => {
        const onClick = () => 'onClickFn';
        const wrapper = mount(
          <BreadcrumbsItem onClick={onClick} text="arbitrary" />,
        );
        expect(wrapper.find(Button).prop('onClick')).toBe(onClick);
      });
    });
    /* eslint-disable react/prop-types, no-unused-vars */
    describe('component prop', () => {
      it('should be reflected to the Button', () => {
        let expectedProps;
        const Link = props => {
          const {
            innerRef,
            truncationWidth,
            iconAfter,
            iconBefore,
            children,
            to,
            ...rest
          } = props;
          expectedProps = rest;
          return (
            <a href={to} {...rest}>
              {children}
            </a>
          );
        };
        const actualComponent = mount(
          <BreadcrumbsItem
            text="arbitrary"
            component={props => (
              <Link to={'/custom/component'} {...props}>
                Custom component
              </Link>
            )}
          />,
        ).find(Link);
        expect(actualComponent.length).toBe(1);
        if (!expectedProps) throw new Error('no expected props');
        Object.keys(expectedProps).forEach(expectedProp =>
          expect(
            Object.keys(actualComponent.props()).includes(expectedProp),
          ).toBe(true),
        );
        expect(actualComponent.props().to).toBe('/custom/component');
      });
    });
  });

  describe('overflow calculation', () => {
    const truncationWidth = 200;
    let item;
    const animStub = window.cancelAnimationFrame;

    beforeEach(() => {
      window.cancelAnimationFrame = () => {};
      const wrapper = mount(
        <BreadcrumbsItem text="content" truncationWidth={truncationWidth} />,
      );
      item = wrapper.instance();
    });

    afterEach(() => {
      window.cancelAnimationFrame = animStub;
    });

    it('for an item which is truncated', () => {
      setItemWidth(item, truncationWidth);
      expect(item.updateOverflow()).toBe(true);
    });

    it('for an item which is not truncated', () => {
      setItemWidth(item, truncationWidth - 1);
      expect(item.updateOverflow()).toBe(false);
    });
  });
});
describe('analytics - BreadcrumbsItem', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<BreadcrumbsItemWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'breadrumbs-item',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onClick handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<BreadcrumbsItemWithAnalytics onClick={spy} />);
    wrapper.find('button').simulate('click');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'click',
      }),
    );
  });

  it('should fire an atlaskit analytics event on click', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <BreadcrumbsItemWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(BreadcrumbsItemWithAnalytics).simulate('click');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'click' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'breadrumbs-item',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
