// @flow

import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import { JiraWordmark } from '@atlaskit/logo';

import BackItemComponent from '../../../components/connected/BackItem';
import ConnectedItemComponent from '../../../components/connected/ConnectedItem';
import GoToItemComponent from '../../../components/connected/GoToItem';
import HeaderSectionComponent from '../../../components/presentational/HeaderSection';
import MenuSectionComponent from '../../../components/presentational/MenuSection';
import ItemsRenderer, { components } from '../../components';

const { BackItem, GoToItem, Item, HeaderSection, MenuSection } = components;

describe('navigation-next view renderer', () => {
  describe('Item component', () => {
    it('should be the ConnectedItem UI component', () => {
      expect(Item).toBe(ConnectedItemComponent);
    });
  });

  describe('GoToItem component', () => {
    it('should be the GoToItem UI component', () => {
      expect(GoToItem).toBe(GoToItemComponent);
    });
  });

  describe('Back Item component', () => {
    it('should be the BackItem UI component', () => {
      expect(BackItem).toBe(BackItemComponent);
    });
  });

  describe('HeaderSection', () => {
    it('should render the HeaderSection UI component', () => {
      const wrapper = shallow(
        <HeaderSection
          id="header"
          items={[{ type: 'Wordmark', wordmark: JiraWordmark, id: 'wordmark' }]}
        >
          {({ className }) => <div className={className} />}
        </HeaderSection>,
      );

      expect(wrapper.find(HeaderSectionComponent)).toHaveLength(1);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the items using ItemsRenderer', () => {
      const items = [
        { type: 'Wordmark', wordmark: JiraWordmark, id: 'wordmark' },
      ];
      const customComponents = { foo: () => null };
      const wrapper = mount(
        <HeaderSection
          customComponents={customComponents}
          id="header"
          items={items}
        >
          {({ className }) => <div className={className} />}
        </HeaderSection>,
      );

      expect(wrapper.find(ItemsRenderer)).toHaveLength(1);
      expect(wrapper.find(ItemsRenderer).props()).toEqual({
        customComponents,
        items,
      });
    });
  });

  describe('MenuSection', () => {
    it('should render the MenuSection UI component', () => {
      const wrapper = shallow(
        <MenuSection
          id="menu"
          items={[
            { type: 'Item', text: 'Backlog', id: 'backlog' },
            { type: 'Item', text: 'Active sprints', id: 'active-sprints' },
            { type: 'Item', text: 'Issues', id: 'issues' },
          ]}
        >
          {({ className }) => <div className={className} />}
        </MenuSection>,
      );

      expect(wrapper.find(MenuSectionComponent)).toHaveLength(1);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the MenuSection UI component correctly with all optional props', () => {
      const items = [
        { type: 'Item', text: 'Backlog', id: 'backlog' },
        { type: 'Item', text: 'Active sprints', id: 'active-sprints' },
        { type: 'Item', text: 'Issues', id: 'issues' },
      ];
      const wrapper = shallow(
        <MenuSection
          id="menu"
          items={items}
          parentId="foo"
          nestedGroupKey="menu"
          alwaysShowScrollHint
        >
          {({ className }) => <div className={className} />}
        </MenuSection>,
      );

      expect(wrapper.find(MenuSectionComponent).props()).toEqual({
        alwaysShowScrollHint: true,
        children: expect.any(Function),
        id: 'menu',
        parentId: 'foo',
      });
    });

    it('should render the items using ItemsRenderer', () => {
      const customComponents = { foo: () => null };
      const items = [
        { type: 'Item', text: 'Backlog', id: 'backlog' },
        { type: 'Item', text: 'Active sprints', id: 'active-sprints' },
        { type: 'Item', text: 'Issues', id: 'issues' },
      ];
      const wrapper = mount(
        <MenuSection
          customComponents={customComponents}
          id="menu"
          items={items}
        >
          {({ className }) => <div className={className} />}
        </MenuSection>,
      );

      expect(wrapper.find(ItemsRenderer)).toHaveLength(1);
      expect(wrapper.find(ItemsRenderer).props()).toEqual({
        customComponents,
        items,
      });
    });
  });

  describe('ItemsRenderer', () => {
    const didMountSpy = jest.fn();
    class Corgie extends Component<{}> {
      componentDidMount() {
        didMountSpy();
      }
      render() {
        return null;
      }
    }

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render items correctly', () => {
      const InlineCustom = () => null;
      const items = [
        { id: 'headerSection', type: 'HeaderSection', items: [] },
        { id: 'menuSection', type: 'MenuSection', items: [] },
        { type: 'Item', id: 'item' },
        { type: 'BackItem', id: 'back-item' },
        { type: 'GoToItem', id: 'goto-item', goTo: 'view' },
        { type: InlineCustom, id: 'inlineCustom' },
        { type: 'Corgie', id: 'corgie' },
      ];
      const wrapper = shallow(
        <ItemsRenderer items={items} customComponents={{ Corgie }} />,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should cache custom components with analytics', () => {
      const items = [{ type: 'Corgie', id: 'corgie' }];
      const wrapper = mount(
        <ItemsRenderer items={items} customComponents={{ Corgie }} />,
      );
      expect(didMountSpy).toHaveBeenCalledTimes(1);
      wrapper.setProps({ foo: 1 });
      expect(didMountSpy).toHaveBeenCalledTimes(1);
    });

    it('should cache inline custom components with analytics', () => {
      const items = [{ type: Corgie, id: 'corgieSpy' }];
      const wrapper = mount(<ItemsRenderer items={items} />);
      expect(didMountSpy).toHaveBeenCalledTimes(1);
      wrapper.setProps({ foo: 1 });
      expect(didMountSpy).toHaveBeenCalledTimes(1);
    });
  });
});
