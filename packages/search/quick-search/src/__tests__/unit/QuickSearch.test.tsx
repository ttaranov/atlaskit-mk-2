import * as React from 'react';
import { mount } from 'enzyme';
import * as PropTypes from 'prop-types';
import { QuickSearch, ResultItemGroup, PersonResult } from '../..';
import AkSearch from '../../components/Search/Search';
import ResultItem from '../../components/ResultItem/ResultItem';

import {
  QS_ANALYTICS_EV_CLOSE,
  QS_ANALYTICS_EV_KB_CTRLS_USED,
  QS_ANALYTICS_EV_OPEN,
  QS_ANALYTICS_EV_QUERY_ENTERED,
  QS_ANALYTICS_EV_SUBMIT,
} from '../../components/constants';

const noOp = () => {};

const isInputFocused = wrapper =>
  wrapper.find('input').getDOMNode() === document.activeElement;

describe('<QuickSearch />', () => {
  const onAnalyticsEventSpy = jest.fn();
  const onClickSpy = jest.fn();

  const exampleChildren = [
    <ResultItemGroup key={0} title="test group 1">
      <PersonResult key={1} resultId="1" name="one" onClick={onClickSpy} />
      <PersonResult key={2} resultId="2" name="two" onClick={onClickSpy} />
    </ResultItemGroup>,
    <ResultItemGroup key={1} title="test group 2">
      <PersonResult resultId="3" name="three" onClick={onClickSpy} />
    </ResultItemGroup>,
  ];

  let wrapper;
  let searchInput;
  let onSearchSubmitSpy: Object;

  const render = (props?: any) => {
    onSearchSubmitSpy = jest.fn();
    wrapper = mount(
      <QuickSearch
        {...props}
        onSearchInput={noOp}
        onSearchSubmit={onSearchSubmitSpy}
      >
        {(props && props.children) || exampleChildren}
      </QuickSearch>,
      {
        context: { onAnalyticsEvent: onAnalyticsEventSpy },
        childContextTypes: { onAnalyticsEvent: PropTypes.func },
      },
    );
    searchInput = wrapper.find(AkSearch).find('input');
  };

  beforeEach(() => {
    render({});
  });

  afterEach(() => {
    onAnalyticsEventSpy.mockReset();
    onClickSpy.mockReset();
  });

  it('should contain a Search component', () => {
    expect(wrapper.find(AkSearch)).toHaveLength(1);
  });

  describe('(Prop) children', () => {
    it('should render its children', () => {
      render({ children: <div id="child" /> });
      expect(wrapper.find('div#child').exists()).toBe(true);
    });

    it('should support non-component children', () => {
      render({ children: 'child' });
      /* Expect that no errors occur while parsing children */
    });

    it('should support non-component grandchildren', () => {
      render({ children: <div>grandchild</div> });
      /* Expect that no errors occur while parsing children */
    });
  });

  describe('Analytics events', () => {
    const getLastEventFired = () => {
      const calls = onAnalyticsEventSpy.mock.calls;
      return calls[calls.length - 1];
    };

    const expectEventFiredLastToBe = (name: string, partialPayload?: any) => {
      expect(getLastEventFired()[0]).toBe(name);
      if (partialPayload) {
        expect(getLastEventFired()[1]).toMatchObject(partialPayload);
      }
    };
    it('should fire event on mount', () => {
      expectEventFiredLastToBe(QS_ANALYTICS_EV_OPEN);
    });

    it('should fire event on unmount', () => {
      wrapper.unmount();
      expectEventFiredLastToBe(QS_ANALYTICS_EV_CLOSE);
    });

    describe('submit/click event', () => {
      it('should fire event on result click', () => {
        const result = wrapper.find(ResultItem).first();
        result.simulate('click');
        expectEventFiredLastToBe(QS_ANALYTICS_EV_SUBMIT);
      });

      it('should carry payload of resultCount, queryLength, index and type', () => {
        const result = wrapper.find(ResultItem).first();
        result.simulate('click');
        const eventData = getLastEventFired()[1];
        expect(eventData).toMatchObject({
          index: expect.any(Number),
          queryLength: expect.any(Number),
          resultCount: expect.any(Number),
          type: expect.any(String),
        });
      });

      it('should fire submit analytics on shortcut submit', () => {
        searchInput.simulate('keydown', { key: 'Enter', shiftKey: true });
        expectEventFiredLastToBe(QS_ANALYTICS_EV_SUBMIT, {
          newTab: false, // enter always open in the same tab
          resultCount: 3,
          method: 'shortcut',
        });
      });
    });

    describe('submit/keyboard event', () => {
      it('should fire event on submit ENTER key stroke when an item is selected', () => {
        wrapper.setProps({ selectedResultId: '1' });
        searchInput.simulate('keydown', { key: 'Enter' });
        expectEventFiredLastToBe(QS_ANALYTICS_EV_SUBMIT);
      });

      it('should carry payload of resultCount, queryLength, index and type when an item is selected', () => {
        wrapper.setProps({ selectedResultId: '1' });
        searchInput.simulate('keydown', { key: 'Enter' });
        const eventData = getLastEventFired()[1];
        expect(eventData).toMatchObject({
          index: expect.any(Number),
          queryLength: expect.any(Number),
          resultCount: expect.any(Number),
          type: expect.any(String),
        });
      });
    });
    describe('keyboard-controls-used event', () => {
      it('ArrowUp', () => {
        searchInput.simulate('keydown', { key: 'ArrowUp' });
        expectEventFiredLastToBe(QS_ANALYTICS_EV_KB_CTRLS_USED);
      });

      it('ArrowDown', () => {
        searchInput.simulate('keydown', { key: 'ArrowDown' });
        expectEventFiredLastToBe(QS_ANALYTICS_EV_KB_CTRLS_USED);
      });

      it('Enter (when a result is selected)', () => {
        wrapper.setProps({ selectedResultId: '1' });
        searchInput.simulate('keydown', { key: 'Enter' });
        const calls = onAnalyticsEventSpy.mock.calls;
        // -2 because the MOST recent event should be the submit event
        expect(calls[calls.length - 2][0]).toBe(QS_ANALYTICS_EV_KB_CTRLS_USED);
      });

      it('should fire event every press', () => {
        searchInput.simulate('keydown', { key: 'ArrowUp' });
        searchInput.simulate('keydown', { key: 'ArrowUp' });
        searchInput.simulate('keydown', { key: 'ArrowUp' });
        const kbCtrlsUsedEventsFired = onAnalyticsEventSpy.mock.calls.filter(
          call => call[0] === QS_ANALYTICS_EV_KB_CTRLS_USED,
        );
        expect(kbCtrlsUsedEventsFired).toHaveLength(3);
      });
    });

    describe('query-entered event', () => {
      it('should fire when search term is entered', () => {
        wrapper.setProps({ value: 'hello' });
        expectEventFiredLastToBe(QS_ANALYTICS_EV_QUERY_ENTERED);
      });

      it('should not fire if previous search term was not empty', () => {
        // Set up non-empty-query state.
        render();
        wrapper.setProps({ value: 'hello' });
        // Clear events fired from mounting
        onAnalyticsEventSpy.mockReset();

        wrapper.setProps({ value: 'goodbye' });
        expect(onAnalyticsEventSpy).not.toHaveBeenCalled();
      });

      it('should only fire once per mount', () => {
        wrapper.setProps({ value: 'hello' });
        expectEventFiredLastToBe(QS_ANALYTICS_EV_QUERY_ENTERED);
        onAnalyticsEventSpy.mockReset();

        wrapper.setProps({ value: '' });
        wrapper.setProps({ value: 'is anybody home?' });
        wrapper.setProps({ value: '' });
        wrapper.setProps({ value: 'HELLOOO?' });
        expect(onAnalyticsEventSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('Keyboard controls', () => {
    it('should select the first result on first DOWN keystroke', () => {
      wrapper
        .find(AkSearch)
        .find('input')
        .simulate('keydown', { key: 'ArrowDown' });

      wrapper.update();
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere(n => n.prop('isSelected'))
          .prop('text'),
      ).toBe('one');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should select the next result on a subsequent DOWN keystroke', () => {
      wrapper
        .find(AkSearch)
        .find('input')
        .simulate('keydown', { key: 'ArrowDown' })
        .simulate('keydown', { key: 'ArrowDown' });

      wrapper.update();
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere(n => n.prop('isSelected'))
          .prop('text'),
      ).toBe('two');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should select the previous result on UP keystroke', () => {
      searchInput.simulate('keydown', { key: 'ArrowDown' });
      searchInput.simulate('keydown', { key: 'ArrowDown' });
      searchInput.simulate('keydown', { key: 'ArrowUp' });
      wrapper.update();
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere(n => n.prop('isSelected'))
          .prop('text'),
      ).toBe('one');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should wrap around to the top when traversing forward past the last result', () => {
      searchInput.simulate('keydown', { key: 'ArrowDown' });
      searchInput.simulate('keydown', { key: 'ArrowDown' });
      searchInput.simulate('keydown', { key: 'ArrowDown' });
      searchInput.simulate('keydown', { key: 'ArrowDown' });
      wrapper.update();
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere(n => n.prop('isSelected'))
          .prop('text'),
      ).toBe('one');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should wrap around to the end when traversing backward past the first result', () => {
      searchInput.simulate('keydown', { key: 'ArrowDown' });
      searchInput.simulate('keydown', { key: 'ArrowUp' });
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere(n => n.prop('isSelected'))
          .prop('text'),
      ).toBe('three');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should select the last result when traversing backward when no result is selected', () => {
      searchInput.simulate('keydown', { key: 'ArrowDown' });
      searchInput.simulate('keydown', { key: 'ArrowUp' });
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere(n => n.prop('isSelected'))
          .prop('text'),
      ).toBe('three');
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should call window.location.assign() with item`s href property', () => {
      const locationAssignSpy = jest.spyOn(window.location, 'assign');
      try {
        const url = 'http://www.atlassian.com';
        wrapper.setProps({
          children: (
            <ResultItemGroup title="test group 2">
              <PersonResult resultId="b" name="test" href={url} />
            </ResultItemGroup>
          ),
          selectedResultId: 'b',
        });
        searchInput.simulate('keydown', { key: 'Enter' });
        wrapper.update();
        expect(locationAssignSpy).toHaveBeenCalledWith(url);
      } finally {
        locationAssignSpy.mockRestore();
      }
    });

    it('should trigger the onClick handler with the same parameters when a result is submitted via keyboards as when clicked', () => {
      searchInput.simulate('keydown', { key: 'Enter' });
      // @ts-ignore - args property not recognised
      const paramsKeyboard = onClickSpy.args;
      onClickSpy.mockClear();
      wrapper
        .find(ResultItem)
        .at(0)
        .simulate('click');
      // @ts-ignore - args property not recognised
      expect(onClickSpy.args).toEqual(paramsKeyboard);
    });

    it('should run the onSearchSubmit callback prop on ENTER keystroke (when no item is selected)', () => {
      searchInput.simulate('keydown', { key: 'Enter' });
      wrapper.update();
      expect(onSearchSubmitSpy).toHaveBeenCalledTimes(1);
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should run the onSearchSubmit callback prop on Shift+ENTER keystroke (even when an item is selected)', () => {
      wrapper.setProps({ selectedResultId: '1' });
      searchInput.simulate('keydown', { key: 'Enter', shiftKey: true });
      wrapper.update();
      expect(onSearchSubmitSpy).toHaveBeenCalledTimes(1);
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it("should run the onClick callback with the result's data on ENTER keystroke (when an item is selected)", () => {
      wrapper.setProps({ selectedResultId: '1' });
      searchInput.simulate('keydown', { key: 'Enter' });
      wrapper.update();
      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should remove any selection when query changes', () => {
      const newChildren = (
        <ResultItemGroup title="test group 2">
          <PersonResult key={1} resultId="4" name="four" />
          <PersonResult key={2} resultId="5" name="five" />
        </ResultItemGroup>
      );
      wrapper.setProps({ children: newChildren });
      wrapper.update();
      expect(
        wrapper.find(ResultItem).filterWhere(n => n.prop('isSelected')),
      ).toHaveLength(0);
      expect(isInputFocused(searchInput)).toBe(true);
    });

    it('should let mouseEnter override keyboard selection', () => {
      // First result is selected by default as established by previous test.
      // Mouse over the third result.
      wrapper
        .find(ResultItem)
        .at(2)
        .find(ResultItem)
        .simulate('mouseenter');
      expect(
        wrapper
          .find(ResultItem)
          .filterWhere(n => n.prop('isSelected'))
          .prop('text'),
      ).toBe('three');
    });

    it('should clear selection onMouseLeave', () => {
      wrapper
        .find(ResultItem)
        .at(2)
        .find(ResultItem)
        .simulate('mouseleave');
      expect(
        wrapper.find(ResultItem).filterWhere(n => n.prop('isSelected')),
      ).toHaveLength(0);
    });

    it('should remove selection on search input blur', () => {
      searchInput.simulate('blur');
      expect(wrapper.find(ResultItem).length).toBeGreaterThan(0);
      expect(
        wrapper.find(ResultItem).filterWhere(n => n.prop('isSelected')),
      ).toHaveLength(0);
    });
  });

  it('should pass through the linkComponent prop', () => {
    const MyLinkComponent = () => <div />;
    wrapper.setProps({ linkComponent: MyLinkComponent });
    wrapper.update();
    expect(
      wrapper
        .find(ResultItem)
        .first()
        .prop('linkComponent'),
    ).toBe(MyLinkComponent);
  });
});
