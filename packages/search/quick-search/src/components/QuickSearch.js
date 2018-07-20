// @flow
import React, { Component, type ComponentType } from 'react';
import { withAnalytics } from '@atlaskit/analytics';

import { type ResultData } from './Results/types';
import AkSearch from './Search/Search';

import decorateWithAnalyticsData from './decorateWithAnalyticsData';
import isReactElement from './isReactElement';
import {
  QS_ANALYTICS_EV_CLOSE,
  QS_ANALYTICS_EV_KB_CTRLS_USED,
  QS_ANALYTICS_EV_OPEN,
  QS_ANALYTICS_EV_QUERY_ENTERED,
  QS_ANALYTICS_EV_SUBMIT,
} from './constants';

const noOp = () => {};

/**
 * Flatten a AkNavigationItemGroups of results into a plain array of results
 * add group index and global index to each child
 * */
const flattenChildren = children =>
  React.Children.toArray(children)
    .filter(childGroup => isReactElement(childGroup))
    .reduce(
      (flatArray, childGroup, sectionIndex) =>
        flatArray.concat(
          React.Children.toArray(childGroup.props.children).map(
            (child, indexWithinSection) => {
              return Object.assign({}, child, {
                props: {
                  ...child.props,
                  analyticsData: {
                    ...child.props.analyticsData,
                    index: flatArray.length + indexWithinSection,
                    sectionIndex,
                    indexWithinSection,
                  },
                },
              });
            },
          ),
        ),
      [],
    );

/**
 * Get the result ID of a result by its index in the flatResults array
 * Returns null for a failed index or if resultId is empty|undefined
 */
const getResultIdByIndex = (array: Array<any>, index: number | null) => {
  if (
    array &&
    index != null &&
    array[index] &&
    array[index].props &&
    array[index].props.resultId
  ) {
    return array[index].props.resultId;
  }
  return null;
};

/**
 * Find a result in the flatResults array by its ID
 * Returns the result object or null
 */
const getResultById = (array, id) =>
  (array &&
    array.find(result => result.props && result.props.resultId === id)) ||
  null;

/**
 * Get a result's index in the flatResults array by its ID
 * Returns a numeric index or null
 */
const getResultIndexById = (array, id) => {
  if (!array) {
    return null;
  }
  const result = getResultById(array, id);
  const index = array.indexOf(result);
  return index >= 0 ? index : null;
};

const adjustIndex = (arrayLength, currentIndex, adjustment) => {
  if (arrayLength === 0) {
    return null;
  }
  if (adjustment === 0) {
    return currentIndex;
  }

  // If nothing is selected, select the element on the end
  if (currentIndex == null) {
    return adjustment > 0 ? 0 : arrayLength - 1;
  }
  // Adjust current index, wrapping around if necessary
  const adjustedIndex = (currentIndex + adjustment) % arrayLength;
  // Correct for negative indices
  return adjustedIndex >= 0 ? adjustedIndex : adjustedIndex + arrayLength;
};

type Props = {
  /** Search results in the form of ResultItemGroups containing Result components */
  children: Node,
  /** Set search loading state */
  isLoading: boolean,
  /** onBlur callback for search input */
  onSearchBlur: (event: Event) => mixed,
  /** onInput callback for search input */
  onSearchInput?: (event: SyntheticInputEvent<any>) => mixed,
  /** onKeyDown callback for search input */
  onSearchKeyDown: (event: Event) => mixed,
  /** Called when the user submits the search form without selecting a result */
  onSearchSubmit: (event: Event) => void,
  /** Placeholder text for search input field */
  placeholder: string,
  /** Value of the search input field */
  value: string,
  /** Corresponds to the `resultId` of the selected result */
  selectedResultId: number | string,
  // Internal: injected by withAnalytics(). Fire a private analytics event
  firePrivateAnalyticsEvent: (eventName: string, eventData?: {}) => {},
  /** React component to be used for rendering links */
  linkComponent?: ComponentType<*>,
};

type State = {
  selectedResultId: number | string | null,
};

export class QuickSearch extends Component<Props, State> {
  static defaultProps = {
    children: [],
    firePrivateAnalyticsEvent: noOp,
    isLoading: false,
    onSearchBlur: noOp,
    onSearchKeyDown: noOp,
    onSearchSubmit: noOp,
    placeholder: 'Search',
    value: '',
  };

  // eslint-disable-next-line react/sort-comp
  flatResults: Array<any> = flattenChildren(this.props.children);
  hasSearchQueryEventFired: boolean = false;
  hasKeyDownEventFired: boolean = false;
  lastKeyPressed: string = '';

  /** Select first result by default if `selectedResultId` prop is not provided */
  state = {
    selectedResultId: this.props.selectedResultId || null,
  };

  componentDidMount() {
    this.props.firePrivateAnalyticsEvent(QS_ANALYTICS_EV_OPEN);
  }

  componentWillUnmount() {
    this.props.firePrivateAnalyticsEvent(QS_ANALYTICS_EV_CLOSE);
  }

  /** Update flatResults array whenever `children` prop changes */
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.children !== this.props.children) {
      this.flatResults = flattenChildren(nextProps.children);
      this.setState({
        selectedResultId: nextProps.selectedResultId || null,
      });
    }

    /**
     * Capture whether user needed to query in order to find their target result.
     * Only fire once per mount. Only fire when a search term is entered and the previous search
     * term was empty.
     */
    if (
      !this.hasSearchQueryEventFired &&
      !this.props.value &&
      nextProps.value
    ) {
      this.hasSearchQueryEventFired = true;
      this.props.firePrivateAnalyticsEvent(QS_ANALYTICS_EV_QUERY_ENTERED);
    }
  }

  fireKeyboardControlEvent(selectedResultId: number | string | null) {
    const { firePrivateAnalyticsEvent } = this.props;
    if (firePrivateAnalyticsEvent) {
      const result = getResultById(this.flatResults, selectedResultId) || {
        props: {},
      };
      firePrivateAnalyticsEvent(QS_ANALYTICS_EV_KB_CTRLS_USED, {
        ...result.props.analyticsData,
        key: this.lastKeyPressed,
        resultId: result.props.resultId,
        contentType: result.props.contentType,
        type: result.props.type,
      });
    }
    this.lastKeyPressed = '';
  }

  /**
   * Uses the virtual list, this.flatResults, to move the selection across grouped results as if
   * results were in a single, circular list.
   *
   * Process:
   * 1. Finds the index of the selected result in the flatResults array,
   * 2. Increments or decrements this index by the supplied adjustment amount,
   * 3. Sets the new selectedResultId based on the modifed index
   */
  adjustSelectedResultIndex = (adjustment: number) => {
    const currentIndex = getResultIndexById(
      this.flatResults,
      this.state.selectedResultId,
    );
    const newIndex: number | null = adjustIndex(
      this.flatResults.length,
      currentIndex,
      adjustment,
    );
    const selectedResultId = getResultIdByIndex(this.flatResults, newIndex);
    this.setState({
      selectedResultId,
    });
    if (selectedResultId) {
      this.fireKeyboardControlEvent(selectedResultId);
    }
  };

  /** Select next result */
  selectNext = () => {
    this.adjustSelectedResultIndex(+1);
  };

  /** Select previous result */
  selectPrevious = () => {
    this.adjustSelectedResultIndex(-1);
  };

  /**
   * Callback for mouseEnter events on individual results
   * Move selection to hovered result
   */
  handleResultMouseEnter = (resultData: ResultData) => {
    this.setState({ selectedResultId: resultData && resultData.resultId });
  };

  /**
   * Callback for mouseLeave events on individual results
   * Clear result selection
   */
  handleResultMouseLeave = () => {
    this.setState({ selectedResultId: null });
  };

  /**
   * Clear result selection when search input is blurred
   */
  handleSearchBlur = (event: Event) => {
    this.props.onSearchBlur(event);
    this.setState({ selectedResultId: null });
  };

  /**
   * Keyboard controls
   * Up - Select previous result
   * Down - Select next result
   * Enter - Submit selected result
   */
  handleSearchKeyDown = (event: Event | KeyboardEvent) => {
    const { firePrivateAnalyticsEvent } = this.props;
    this.props.onSearchKeyDown(event);

    // Capture whether users are using keyboard controls
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'Enter'
    ) {
      this.lastKeyPressed = event.key;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault(); // Don't move cursor around in search input field
      this.selectPrevious();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault(); // Don't move cursor around in search input field
      this.selectNext();
    } else if (event.key === 'Enter') {
      // shift key pressed or no result selected
      if (event.shiftKey || !this.state.selectedResultId) {
        this.props.onSearchSubmit(event);
      } else {
        event.preventDefault(); // Don't fire submit event from input
        const result = getResultById(
          this.flatResults,
          this.state.selectedResultId,
        );

        if (!result || !result.props) {
          return;
        }

        // Capture when users are using the keyboard to submit
        if (typeof firePrivateAnalyticsEvent === 'function') {
          this.fireKeyboardControlEvent(this.state.selectedResultId);
          firePrivateAnalyticsEvent(QS_ANALYTICS_EV_SUBMIT, {
            ...result.props.analyticsData,
            method: 'returnKey',
            resultId: result.props.resultId,
            type: result.props.type,
            contentType: result.props.contentType,
            newTab: false, // enter always open in the same tab
          });
        }

        if (result.props.onClick) {
          result.props.onClick({
            resultId: result.props.resultId,
            type: result.props.type,
          });
        }
        if (result.props.href) {
          window.location.assign(result.props.href);
        }
      }
    }
  };

  /**
   * Render QuickSearch's children, attaching extra props for interactions
   */
  renderChildren() {
    let ii = 0;
    /** Attach mouse interaction handlers and determine whether this result is selected */
    const renderResult = (result, indexWithinSection, sectionIndex) => {
      // return native element as-is
      if (!isReactElement(result)) {
        return result;
      }

      const isSelected =
        Boolean(result.props) &&
        result.props.resultId === this.state.selectedResultId;

      return React.cloneElement(result, {
        analyticsData: {
          ...result.props.analyticsData,
          index: ii++,
          indexWithinSection,
          sectionIndex,
        },
        isSelected,
        onMouseEnter: this.handleResultMouseEnter,
        onMouseLeave: this.handleResultMouseLeave,
        sendAnalytics: this.props.firePrivateAnalyticsEvent,
        linkComponent: this.props.linkComponent,
      });
    };

    /** Process a group of results */
    const renderGroup = (group, sectionIndex) => {
      // return native element as-is
      if (!isReactElement(group)) {
        return group;
      }

      return React.cloneElement(
        group,
        null,
        React.Children.map(group.props.children, (result, resultIndex) =>
          renderResult(result, resultIndex, sectionIndex),
        ),
      );
    };

    return React.Children.map(this.props.children, renderGroup);
  }

  render() {
    return (
      <AkSearch
        isLoading={this.props.isLoading}
        onBlur={this.handleSearchBlur}
        onInput={this.props.onSearchInput}
        onKeyDown={this.handleSearchKeyDown}
        placeholder={this.props.placeholder}
        value={this.props.value}
      >
        {this.renderChildren()}
      </AkSearch>
    );
  }
}

/**
 * HOCs:
 * `decorateWithAnalyticsData` - Wrapper that decorates analytics events with additional data.
 * `withAnalytics` - Injects analytics firing methods that are picked up by
 * @atlaskit/analytics/AnalyticsListener.
 */
export default decorateWithAnalyticsData(withAnalytics(QuickSearch));
