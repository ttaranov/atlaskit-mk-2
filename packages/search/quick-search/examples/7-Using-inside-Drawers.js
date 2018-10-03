// @flow
import React, { Component, type Ref } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@atlaskit/drawer';

import { objectData, personData, containerData } from './utils/mockData';
import {
  QuickSearch,
  ResultItemGroup,
  ContainerResult,
  PersonResult,
  ObjectResult,
} from '../src';

type DataShape = {
  title: string,
  items: Array<any>,
};

const data: DataShape[] = [
  {
    title: 'Objects',
    items: objectData(5),
  },
  {
    title: 'People',
    items: personData(5),
  },
  {
    title: 'Containers',
    items: containerData(5),
  },
];

const availableResultTypes = {
  person: PersonResult,
  object: ObjectResult,
  container: ContainerResult,
};

const mapResultsDataToComponents = resultData => {
  if (!resultData || !resultData.length) {
    return 'Nothin` to see here';
  }

  return resultData.map(group => (
    <ResultItemGroup title={group.title} key={group.title}>
      {group.items.map(props => {
        const Result = availableResultTypes[props.type];
        return Result ? (
          <Result key={props.resultId} {...props} isSelected={false} />
        ) : null;
      })}
    </ResultItemGroup>
  ));
};

function contains(string, query) {
  return string.toLowerCase().indexOf(query.toLowerCase()) > -1;
}

function searchData(query: string): DataShape[] {
  const results = data
    .map(({ title, items }) => {
      const filteredItems = items.filter(item => contains(item.name, query));
      return { title, items: filteredItems };
    })
    .filter(group => group.items.length);
  return results;
}

// a little fake store for holding the query after a component unmounts
const store = {};

type BasicQuickSearchState = {
  query: string,
  results: DataShape[],
  isLoading: boolean,
};

// eslint-disable-next-line react/no-multi-comp
class BasicQuickSearch extends Component<*, BasicQuickSearchState> {
  static propTypes = {
    fakeNetworkLatency: PropTypes.number,
  };

  static defaultProps = {
    fakeNetworkLatency: 0,
  };

  state = {
    query: store.query || '',
    results: searchData(''),
    isLoading: false,
  };

  searchTimeoutId: ?TimeoutID;

  setQuery(query) {
    store.query = query;
    this.setState({
      query,
    });
  }

  search = (query: string) => {
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }
    this.setState({
      isLoading: true,
    });
    this.setQuery(query);
    const results = searchData(query);
    this.searchTimeoutId = setTimeout(() => {
      this.setState({
        results,
        isLoading: false,
      });
    }, this.props.fakeNetworkLatency);
  };

  quickSearchInnerRef: mixed;

  setQuickSearchRef = (ref: any) => {
    this.quickSearchInnerRef = ref;
  };

  render() {
    return (
      <QuickSearch
        isLoading={this.state.isLoading}
        onSearchInput={({ target }) => {
          this.search(target.value);
        }}
        onSearchSubmit={() => console.log('onSearchSubmit', this.state.query)}
        value={this.state.query}
        innerRef={this.setQuickSearchRef}
      >
        <div style={{ paddingLeft: '10px' }}>
          {mapResultsDataToComponents(this.state.results)}
        </div>
      </QuickSearch>
    );
  }
}

type State = {
  isDrawerOpen: boolean,
  shouldUnmountOnExit: boolean,
};

// eslint-disable-next-line react/no-multi-comp
export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: false,
    shouldUnmountOnExit: true,
  };

  quickSearchRef: any;

  openDrawer = () => {
    this.setState({
      isDrawerOpen: true,
    });
    if (
      this.quickSearchRef &&
      typeof this.quickSearchRef.focusSearchInput === 'function'
    ) {
      this.quickSearchRef.focusSearchInput();
    }
  };

  closeDrawer = () =>
    this.setState({
      isDrawerOpen: false,
    });

  toggleUnmountBehaviour = () => {
    this.setState(({ shouldUnmountOnExit: shouldUnmountOnExitValue }) => ({
      shouldUnmountOnExit: !shouldUnmountOnExitValue,
    }));
  };

  setQuickSearchRef = (ref: any) => {
    this.quickSearchRef = ref.quickSearchInnerRef;
  };

  render() {
    return (
      <div css={{ padding: '2rem' }}>
        <Drawer
          isOpen={this.state.isDrawerOpen}
          onClose={this.closeDrawer}
          width="wide"
          shouldUnmountOnExit={this.state.shouldUnmountOnExit}
        >
          <BasicQuickSearch ref={this.setQuickSearchRef} />
        </Drawer>
        <button type="button" onClick={this.openDrawer}>
          Open drawer
        </button>
        <div css={{ marginTop: '2rem' }}>
          <label htmlFor="checkbox">
            <input
              id="checkbox"
              type="checkbox"
              value={this.state.shouldUnmountOnExit}
              onChange={this.toggleUnmountBehaviour}
            />
            Toggle remounting of drawer contents on exit
          </label>
          <div css={{ display: 'block', paddingTop: '1rem' }}>
            Contents of the drawer will be{' '}
            <strong>{`${
              this.state.shouldUnmountOnExit ? 'discarded' : 'retained'
            }`}</strong>{' '}
            on closing the drawer
          </div>
        </div>
      </div>
    );
  }
}
