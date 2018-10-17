// @flow

import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import { JiraWordmark } from '@atlaskit/logo';
import Spinner from '@atlaskit/spinner';
import { Provider } from 'unstated';

import { NavigationProvider, ViewController } from '../../../';
import ItemComponent from '../../../components/presentational/Item';
import HeaderSectionComponent from '../../../components/presentational/HeaderSection';
import MenuSectionComponent from '../../../components/presentational/MenuSection';
import ItemsRenderer, { components } from '../../components';

const { GoToItem, Item, HeaderSection, MenuSection } = components;

const mountWithProvider = element =>
  mount(<NavigationProvider cache={false}>{element}</NavigationProvider>);

describe('navigation-next view renderer', () => {
  describe('Item', () => {
    it('should render the Item UI component', () => {
      const wrapper = shallow(<Item text="Item" id="id" />);
      expect(wrapper.find(ItemComponent)).toHaveLength(1);
    });
    it('should render a GoToItem if a goTo prop is passed', () => {
      const withGoTo = mountWithProvider(
        <Item text="Item" id="id" goTo="view" />,
      );
      expect(withGoTo.find(GoToItem)).toHaveLength(1);
    });
  });

  describe('GoToItem', () => {
    it("should render an arrow icon in the after slot of the Item when it's in the hover state", () => {
      const notInHoverState = mountWithProvider(
        <GoToItem id="id" goTo="view" />,
      );
      expect(notInHoverState.find(ArrowRightCircleIcon)).toHaveLength(0);

      const inHoverState = mountWithProvider(
        <GoToItem id="id" goTo="view" isHover />,
      );
      expect(inHoverState.find(ArrowRightCircleIcon)).toHaveLength(1);

      // Confirm that the icon is being passed as the 'after' prop for the
      // underlying Item
      const itemAfter = mount(
        inHoverState
          .find(ItemComponent)
          .props()
          .after({ isActive: false, isHover: true, isSelected: false }),
      );
      expect(itemAfter.find(ArrowRightCircleIcon)).toHaveLength(1);
    });

    it('should render a spinner in the after slot of the Item when the to prop matches the incomingView.id', () => {
      const notMatchingIncomingView = mountWithProvider(
        <GoToItem id="id" goTo="view" />,
      );
      expect(notMatchingIncomingView.find(Spinner)).toHaveLength(0);

      const viewController = new ViewController();
      const view = {
        id: 'view',
        type: 'product',
        // Returning a Promise here means that the view will be set as the
        // incomingView.
        getItems: () => new Promise(() => {}),
      };
      viewController.addView(view);
      viewController.setView(view.id);

      const matchesIncoming = mount(
        <Provider inject={[viewController]}>
          <GoToItem id="id" goTo={view.id} isHover />
        </Provider>,
      );
      expect(matchesIncoming.find(Spinner)).toHaveLength(1);

      // Confirm that the spinner is being passed as the 'after' prop for the
      // underlying Item
      const itemAfter = mount(
        matchesIncoming
          .find(ItemComponent)
          .props()
          .after({ isActive: false, isHover: true, isSelected: false }),
      );
      expect(itemAfter.find(Spinner)).toHaveLength(1);
    });
  });

  describe('HeaderSection', () => {
    it('should render the HeaderSection UI component', () => {
      const wrapper = shallow(
        <HeaderSection
          id="header"
          items={[{ type: 'Wordmark', wordmark: JiraWordmark, id: 'wordmark' }]}
        />,
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
        />,
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
        />,
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
        />,
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
        />,
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
