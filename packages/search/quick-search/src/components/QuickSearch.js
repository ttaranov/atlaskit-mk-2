// @flow
import React, { Component, type ComponentType } from 'react';
import { withAnalytics } from '@atlaskit/analytics';

import type { ResultData, Context } from './Results/types';
import AkSearch from './Search/Search';
import { type ResultBaseType } from './Results/ResultBase';
import { ResultContext, SelectedResultIdContext } from './context';

import decorateWithAnalyticsData from './decorateWithAnalyticsData';
import {
  QS_ANALYTICS_EV_CLOSE,
  QS_ANALYTICS_EV_KB_CTRLS_USED,
  QS_ANALYTICS_EV_OPEN,
  QS_ANALYTICS_EV_QUERY_ENTERED,
  QS_ANALYTICS_EV_SUBMIT,
} from './constants';

const noOp = () => {};

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
  context: Context,
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

  flatResults: Array<ResultBaseType> = [];
  hasSearchQueryEventFired: boolean = false;
  hasKeyDownEventFired: boolean = false;
  lastKeyPressed: string = '';

  constructor(props: Props) {
    super(props);

    this.state = {
      /** Select first result by default if `selectedResultId` prop is not provided */
      selectedResultId: this.props.selectedResultId || null,
      context: {
        registerResult: (result: ResultBaseType) => {
          if (!this.flatResults.includes(result)) {
            this.flatResults.push(result);
          }
        },
        onMouseEnter: this.handleResultMouseEnter,
        onMouseLeave: this.handleResultMouseLeave,
        sendAnalytics: this.props.firePrivateAnalyticsEvent,
        getIndex: (resultId: string | number) => {
          return getResultIndexById(this.flatResults, resultId);
        },
        linkComponent: this.props.linkComponent,
      },
    };
  }

  /**
    * Reconcile list of results for keyboard navigation after every update.

    1. Empty list of results
    2. Set isDirty=true to signal ResultBase components to register
    3. componentDidMount / componentDidUpdate lifecycle methods in ResultBase will be invoked
    4. All ResultBase components call registerResult() in order to register itself
    4. When update is complete set isDirty=false to finish reconcillation.
   */
  resetResults() {
    this.flatResults = [];
  }

  componentDidMount() {
    this.props.firePrivateAnalyticsEvent(QS_ANALYTICS_EV_OPEN);
  }

  componentWillUnmount() {
    this.props.firePrivateAnalyticsEvent(QS_ANALYTICS_EV_CLOSE);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.children !== this.props.children) {
      this.resetResults();
      this.setState({
        selectedResultId: nextProps.selectedResultId || null,
      });
    } else if (
      nextProps.selectedResultId ||
      (this.props.selectedResultId && nextProps.selectedResultId) ||
      this.state.selectedResultId
    ) {
      this.setState({
        selectedResultId: nextProps.selectedResultId || null,
      });
    }

    // keep context state in sync
    const { sendAnalytics, linkComponent } = this.state.context;
    if (
      sendAnalytics !== nextProps.firePrivateAnalyticsEvent ||
      linkComponent !== nextProps.linkComponent
    ) {
      this.setState({
        context: {
          ...this.state.context,
          sendAnalytics: nextProps.firePrivateAnalyticsEvent,
          linkComponent: nextProps.linkComponent,
        },
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
      const result = getResultById(this.flatResults, selectedResultId);
      if (result) {
        firePrivateAnalyticsEvent(QS_ANALYTICS_EV_KB_CTRLS_USED, {
          ...result.getAnalyticsData(),
          key: this.lastKeyPressed,
        });
      }
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
            ...result.getAnalyticsData(),
            method: 'returnKey',
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
        <ResultContext.Provider value={this.state.context}>
          <SelectedResultIdContext.Provider value={this.state.selectedResultId}>
            {this.props.children}
          </SelectedResultIdContext.Provider>
        </ResultContext.Provider>
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
