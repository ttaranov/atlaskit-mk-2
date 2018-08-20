// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import Spinner from '@atlaskit/spinner';
import { Provider } from 'unstated';

import { NavigationProvider, ViewController } from '../../../';
import BaseItem from '../../../components/Item';
import { components } from '../../components';

const { GoToItem, Item } = components;

const mountWithProvider = element =>
  mount(<NavigationProvider cache={false}>{element}</NavigationProvider>);

describe('navigation-next view renderer', () => {
  describe('Item', () => {
    it('should render the Item UI component', () => {
      const wrapper = shallow(<Item id="id" />);
      expect(wrapper.find(BaseItem)).toHaveLength(1);
    });
    it('should render a GoToItem if a goTo prop is passed', () => {
      const withGoTo = mountWithProvider(<Item id="id" goTo="view" />);
      expect(withGoTo.find(GoToItem)).toHaveLength(1);
    });
  });

  describe('GoToItem', () => {
    it("should render an arrow icon in the after slot of the Item when it's in the hover state", () => {
      const notInHoverState = mountWithProvider(
        <GoToItem id="id" goTo="view" />,
      );
      expect(notInHoverState.find(ArrowRightIcon)).toHaveLength(0);

      const inHoverState = mountWithProvider(
        <GoToItem id="id" goTo="view" isHover />,
      );
      expect(inHoverState.find(ArrowRightIcon)).toHaveLength(1);

      // Confirm that the icon is being passed as the 'after' prop for the
      // underlying Item
      const itemAfter = mount(
        inHoverState
          .find(BaseItem)
          .props()
          .after({ isActive: false, isHover: true, isSelected: false }),
      );
      expect(itemAfter.find(ArrowRightIcon)).toHaveLength(1);
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
          .find(BaseItem)
          .props()
          .after({ isActive: false, isHover: true, isSelected: false }),
      );
      expect(itemAfter.find(Spinner)).toHaveLength(1);
    });
  });
});
