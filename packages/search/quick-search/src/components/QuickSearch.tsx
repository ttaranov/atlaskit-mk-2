import * as React from 'react';
import { withAnalytics, FireAnalyticsEvent } from '@atlaskit/analytics';
import { ResultData, SelectedResultId, ResultId } from './Results/types';
import AkSearch from './Search/Search';
import {
  ResultContext,
  SelectedResultIdContext,
  ResultContextType,
} from './context';

import decorateWithAnalyticsData from './decorateWithAnalyticsData';
import {
  QS_ANALYTICS_EV_CLOSE,
  QS_ANALYTICS_EV_KB_CTRLS_USED,
  QS_ANALYTICS_EV_OPEN,
  QS_ANALYTICS_EV_QUERY_ENTERED,
  QS_ANALYTICS_EV_SUBMIT,
} from './constants';
import { ResultBase } from './Results/ResultBase';

/**
 * Get the result ID of a result by its index in the flatResults array
 * Returns null for a failed index or if resultId is empty|undefined
 */
const getResultIdByIndex = (array: ResultBase[], index: number | null) => {
  if (
    array &&
    index !== null &&
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
const getResultById = (array: ResultBase[], id: SelectedResultId) =>
  (array &&
    array.find(result => result.props && result.props.resultId === id)) ||
  null;

/**
 * Get a result's index in the flatResults array by its ID
 * Returns a numeric index or null
 */
const getResultIndexById = (array: ResultBase[], id: SelectedResultId) => {
  if (!array) {
    return null;
  }
  const result = getResultById(array, id);
  if (!result) {
    return null;
  }
  const index = array.indexOf(result);
  return index >= 0 ? index : null;
};

const adjustIndex = (
  arrayLength: number,
  currentIndex: number | null,
  adjustment: number,
) => {
  if (arrayLength === 0) {
    return null;
  }
  if (adjustment === 0) {
    return currentIndex;
  }

  // If nothing is selected, select the element on the end
  if (currentIndex === null) {
    return adjustment > 0 ? 0 : arrayLength - 1;
  }
  // Adjust current index, wrapping around if necessary
  const adjustedIndex = (currentIndex + adjustment) % arrayLength;
  // Correct for negative indices
  return adjustedIndex >= 0 ? adjustedIndex : adjustedIndex + arrayLength;
};

export type Props = {
  /** Search results in the form of ResultItemGroups containing Result components */
  children: React.ReactNode;
  /** Set search loading state */
  isLoading?: boolean;
  /** onBlur callback for search input */
  onSearchBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** onInput callback for search input */
  onSearchInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  /** onKeyDown callback for search input */
  onSearchKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Called when the user submits the search form without selecting a result */
  onSearchSubmit?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Placeholder text for search input field */
  placeholder?: string;
  /** Value of the search input field */
  value?: string;
  /** Corresponds to the `resultId` of the selected result */
  selectedResultId?: SelectedResultId;
  // Internal: injected by withAnalytics(). Fire a private analytics event
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
  /** React component to be used for rendering links */
  linkComponent?: React.ComponentType;
};

export type State = {
  selectedResultId: SelectedResultId;
  context: ResultContextType;
};

export class QuickSearch extends React.Component<Props, State> {
  static defaultProps = {
    children: [],
    firePrivateAnalyticsEvent: (_: any) => {},
    isLoading: false,
    onSearchBlur: (_: any) => {},
    onSearchKeyDown: (_: any) => {},
    onSearchSubmit: (_: any) => {},
    placeholder: 'Search',
    value: '',
  };

  inputSearchRef: React.Ref<any>;
  flatResults: Array<ResultBase> = [];
  hasSearchQueryEventFired: boolean = false;
  hasKeyDownEventFired: boolean = false;
  lastKeyPressed: string = '';

  constructor(props: Props) {
    super(props);

    this.state = {
      /** Select first result by default if `selectedResultId` prop is not provided */
      selectedResultId: this.props.selectedResultId || null,
      context: {
        registerResult: this.handleRegisterResult,
        unregisterResult: this.handleUnregisterResult,
        onMouseEnter: this.handleResultMouseEnter,
        onMouseLeave: this.handleResultMouseLeave,
        sendAnalytics: this.props.firePrivateAnalyticsEvent,
        getIndex: (resultId: ResultId) => {
          return getResultIndexById(this.flatResults, resultId);
        },
        linkComponent: this.props.linkComponent,
      },
    };
  }

  componentDidMount() {
    const { firePrivateAnalyticsEvent } = this.props;
    if (firePrivateAnalyticsEvent) {
      firePrivateAnalyticsEvent(QS_ANALYTICS_EV_OPEN, {});
    }
  }

  componentWillUnmount() {
    const { firePrivateAnalyticsEvent } = this.props;
    if (firePrivateAnalyticsEvent) {
      firePrivateAnalyticsEvent(QS_ANALYTICS_EV_CLOSE, {});
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.children !== this.props.children) {
      this.setState({
        selectedResultId: nextProps.selectedResultId || null,
      });
    } else if (
      nextProps.selectedResultId !== this.props.selectedResultId &&
      nextProps.selectedResultId !== this.state.selectedResultId
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
      const { firePrivateAnalyticsEvent } = this.props;
      if (firePrivateAnalyticsEvent) {
        firePrivateAnalyticsEvent(QS_ANALYTICS_EV_QUERY_ENTERED, {});
      }
    }
  }

  fireKeyboardControlEvent(selectedResultId: SelectedResultId) {
    const { firePrivateAnalyticsEvent } = this.props;
    if (firePrivateAnalyticsEvent) {
      const result = getResultById(this.flatResults, selectedResultId);
      if (result) {
        firePrivateAnalyticsEvent(QS_ANALYTICS_EV_KB_CTRLS_USED, {
          ...result.getAnalyticsData(),
          key: this.lastKeyPressed,
          resultCount: this.flatResults.length,
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
   * Callback for register results in flatResults
   */
  handleRegisterResult = (result: ResultBase) => {
    if (!getResultById(this.flatResults, result.props.resultId)) {
      this.flatResults.push(result);
    }
  };

  /**
   * Callback for unregister results in flatResults
   * It will reconcile a list of results for keyboard navigation after every update.
   * 1. Component starts with an empty list of results
   * 2. componentDidMount / componentDidUpdate lifecycle methods in ResultBase will be invoked
   * 3. All ResultBase components call registerResult() in order to register itself in quick search
   * 4. All ResultBase components call unregisterResult() in order to unregister itself in quick search
   */
  handleUnregisterResult = (result: ResultBase) => {
    const resultIndex = getResultIndexById(
      this.flatResults,
      result.props.resultId,
    );
    if (resultIndex) {
      this.flatResults.splice(resultIndex, 1);
    }
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
  handleSearchBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    this.props.onSearchBlur!(event);
    this.setState({ selectedResultId: null });
  };

  /**
   * Keyboard controls
   * Up - Select previous result
   * Down - Select next result
   * Enter - Submit selected result
   */
  handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { firePrivateAnalyticsEvent } = this.props;
    this.props.onSearchKeyDown!(event);

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
        if (firePrivateAnalyticsEvent) {
          firePrivateAnalyticsEvent(QS_ANALYTICS_EV_SUBMIT, {
            newTab: false, // enter always open in the same tab
            resultCount: this.flatResults.length,
            method: 'shortcut',
          });
        }
        this.props.onSearchSubmit!(event);
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
            resultCount: this.flatResults.length,
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

  setSearchInputRef = (refs: any) => {
    if (refs && refs.inputRef) {
      this.inputSearchRef = refs.inputRef;
    }
  };

  focusSearchInput = () => {
    if (
      this.inputSearchRef &&
      // @ts-ignore unchecked
      typeof this.inputSearchRef.focus === 'function'
    ) {
      // @ts-ignore unchecked
      this.inputSearchRef.focus();
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
        ref={this.setSearchInputRef}
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
export default decorateWithAnalyticsData(
  withAnalytics<typeof QuickSearch>(QuickSearch, {}, {}),
);
