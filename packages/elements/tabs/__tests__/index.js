// @flow
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';

import Tabs, { TabContent, TabItem } from '../src';
import type {
  TabContentComponentProvided,
  TabItemComponentProvided,
} from '../src/types';
import { name } from '../package.json';

const tabs = [
  { content: 'Tab 1 content', label: 'Tab 1 label' },
  { content: 'Tab 2 content', label: 'Tab 2 label' },
  { content: 'Tab 3 content', label: 'Tab 3 label' },
];

describe(name, () => {
  describe('Tabs', () => {
    describe('rendering', () => {
      const wrapper = mount(<Tabs tabs={tabs} />);

      it('should be able to create a component', () => {
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should render a tab navigation item for every entry in the array', () => {
        expect(wrapper.find(TabItem)).toHaveLength(tabs.length);
      });

      it('should only ever render a single tab content pane', () => {
        expect(wrapper.find(TabContent)).toHaveLength(1);
      });
    });

    describe('props', () => {
      describe('defaultSelectedTab', () => {
        it('should set the selected tab on initial mount', () => {
          const wrapper = shallow(
            <Tabs tabs={tabs} defaultSelectedTab={tabs[1]} />,
          );
          expect(wrapper.state().selectedTab).toEqual(tabs[1]);
        });

        it('should accept an index', () => {
          const wrapper = shallow(<Tabs tabs={tabs} defaultSelectedTab={2} />);
          expect(wrapper.state().selectedTab).toEqual(tabs[2]);
        });

        it('should use the isSelectedTest function if provided', () => {
          const isSelectedTest = (selectedTab, tab) =>
            tab.label === selectedTab;
          const wrapper = shallow(
            <Tabs
              tabs={tabs}
              defaultSelectedTab={'Tab 2 label'}
              isSelectedTest={isSelectedTest}
            />,
          );
          expect(wrapper.state().selectedTab).toEqual(tabs[1]);
        });

        it('changing this prop should not update the selected tab after the initial mount', () => {
          const wrapper = shallow(
            <Tabs tabs={tabs} defaultSelectedTab={tabs[1]} />,
          );
          wrapper.setProps({ defaultSelectedTab: tabs[2] });
          expect(wrapper.state().selectedTab).toEqual(tabs[1]);
        });
      });

      describe('selectedTab', () => {
        it('should set the selected tab on initial mount', () => {
          const wrapper = shallow(<Tabs tabs={tabs} selectedTab={tabs[1]} />);
          expect(wrapper.state().selectedTab).toEqual(tabs[1]);
        });

        it('should take precedence over defaultSelectedTab', () => {
          const wrapper = shallow(
            <Tabs
              tabs={tabs}
              defaultSelectedTab={tabs[1]}
              selectedTab={tabs[2]}
            />,
          );
          expect(wrapper.state().selectedTab).toEqual(tabs[2]);
        });

        it('should use the isSelectedTest function if provided', () => {
          const isSelectedTest = (selectedTab, tab) =>
            tab.label === selectedTab;
          const wrapper = shallow(
            <Tabs
              tabs={tabs}
              selectedTab={'Tab 2 label'}
              isSelectedTest={isSelectedTest}
            />,
          );
          expect(wrapper.state().selectedTab).toEqual(tabs[1]);
        });

        it('changing this prop should update the selected tab after the initial mount', () => {
          const wrapper = shallow(<Tabs tabs={tabs} selectedTab={tabs[1]} />);
          wrapper.setProps({ selectedTab: tabs[2] });
          expect(wrapper.state().selectedTab).toEqual(tabs[2]);
        });

        it('should default to the first tab if neither selectedTab nor defaultSelectedTab are set', () => {
          const wrapper = shallow(<Tabs tabs={tabs} />);
          expect(wrapper.state().selectedTab).toEqual(tabs[0]);
        });

        it("setting this prop should make the component 'controlled', which means it should not maintain its own internal state", () => {
          const uncontrolledTabs = mount(
            <Tabs tabs={tabs} defaultSelectedTab={tabs[1]} />,
          );
          uncontrolledTabs
            .find(TabItem)
            .at(2)
            .simulate('click');
          expect(uncontrolledTabs.state().selectedTab).toEqual(tabs[2]);

          const controlledTab = mount(
            <Tabs tabs={tabs} selectedTab={tabs[1]} />,
          );
          controlledTab
            .find(TabItem)
            .at(2)
            .simulate('click');
          expect(controlledTab.state().selectedTab).toEqual(tabs[1]);
        });
      });

      describe('isSelectedTest', () => {
        it('should override the in-built check to determine whether a tab is selected', () => {
          const isSelectedTest = (selectedTab, tab) =>
            tab.label === selectedTab;
          const wrapper = shallow(
            <Tabs tabs={tabs} isSelectedTest={isSelectedTest} />,
          );
          expect(wrapper.state().selectedTab).toEqual(tabs[0]);
          wrapper.setProps({ selectedTab: 'Tab 2 label' });
          expect(wrapper.state().selectedTab).toEqual(tabs[1]);
        });
      });

      describe('tabItemComponent', () => {
        it('should render a custom tab item component if provided', () => {
          const TabItemComponent = (props: TabItemComponentProvided) => (
            <div>{props.data.label}</div>
          );
          const wrapper = mount(
            <Tabs tabs={tabs} tabItemComponent={TabItemComponent} />,
          );
          expect(wrapper.find(TabItemComponent)).toHaveLength(tabs.length);
        });

        it('should render the in-built tab item by default', () => {
          const wrapper = mount(<Tabs tabs={tabs} />);
          expect(wrapper.find(TabItem)).toHaveLength(tabs.length);
        });
      });

      describe('tabContentComponent', () => {
        it('should render a custom tab content component if provided', () => {
          const TabContentComponent = (props: TabContentComponentProvided) => (
            <div>{props.data.content}</div>
          );
          const wrapper = mount(
            <Tabs tabs={tabs} tabContentComponent={TabContentComponent} />,
          );
          expect(wrapper.find(TabContentComponent)).toHaveLength(1);
        });

        it('should render the in-built tab content pane by default', () => {
          const wrapper = mount(<Tabs tabs={tabs} />);
          expect(wrapper.find(TabContent)).toHaveLength(1);
        });
      });

      describe('onSelect', () => {
        it('is not fired for default selected tab', () => {
          const spy = jest.fn();
          mount(
            <Tabs onSelect={spy} tabs={tabs} defaultSelectedTab={tabs[0]} />,
          );
          mount(<Tabs onSelect={spy} tabs={tabs} selectedTab={tabs[0]} />);
          expect(spy).not.toHaveBeenCalled();
        });
        it('is fired with the selected tab and its index when selected by click', () => {
          const spy = jest.fn();
          const wrapper = mount(<Tabs onSelect={spy} tabs={tabs} />);

          wrapper
            .find(TabItem)
            .at(2)
            .simulate('click');
          expect(spy).toHaveBeenCalledWith(tabs[2], 2);
        });
        it('is fired with the selected tab and its index when selected by keyboard', () => {
          const spy = jest.fn();
          const wrapper = mount(<Tabs onSelect={spy} tabs={tabs} />);

          wrapper
            .find(TabItem)
            .at(0)
            .simulate('keyDown', {
              key: 'ArrowRight',
            });
          expect(spy).toHaveBeenCalledWith(tabs[1], 1);
        });
      });
    });

    describe('behaviour', () => {
      describe('keyboard navigation', () => {
        describe('with 3 tabs, when the 2nd tab is selected', () => {
          let wrapper;
          const simulateKeyboardNav = (index, key) => {
            wrapper
              .find(TabItem)
              .at(index)
              .simulate('keyDown', { key });
          };

          beforeEach(() => {
            wrapper = mount(<Tabs tabs={tabs} defaultSelectedTab={tabs[1]} />);
          });

          it('pressing LEFT arrow selects the first tab', () => {
            expect(wrapper.state().selectedTab).toBe(tabs[1]);
            simulateKeyboardNav(1, 'ArrowLeft');
            expect(wrapper.state().selectedTab).toBe(tabs[0]);
          });

          it('pressing the RIGHT arrow selects the last tab', () => {
            expect(wrapper.state().selectedTab).toBe(tabs[1]);
            simulateKeyboardNav(1, 'ArrowRight');
            expect(wrapper.state().selectedTab).toBe(tabs[2]);
          });

          it('pressing the LEFT arrow twice leaves selection on the first tab', () => {
            expect(wrapper.state().selectedTab).toBe(tabs[1]);
            simulateKeyboardNav(1, 'ArrowLeft');
            simulateKeyboardNav(0, 'ArrowLeft');
            expect(wrapper.state().selectedTab).toBe(tabs[0]);
          });

          it('pressing the RIGHT arrow twice leaves selection on the last tab', () => {
            expect(wrapper.state().selectedTab).toBe(tabs[1]);
            simulateKeyboardNav(1, 'ArrowRight');
            simulateKeyboardNav(2, 'ArrowRight');
            expect(wrapper.state().selectedTab).toBe(tabs[2]);
          });
        });
      });
    });
  });
});
