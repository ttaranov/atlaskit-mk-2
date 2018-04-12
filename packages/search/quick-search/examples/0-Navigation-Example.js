// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navigation, { AkSearchDrawer } from '@atlaskit/navigation';
import { objectData, personData, containerData } from './utils/mockData';
import {
  QuickSearch,
  ResultItemGroup,
  ContainerResult,
  PersonResult,
  ObjectResult,
} from '../src';

const noop = () => {};

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

  render() {
    return (
      <QuickSearch
        isLoading={this.state.isLoading}
        onSearchInput={({ target }) => {
          this.search(target.value);
        }}
        onSearchSubmit={() => console.log('onSearchSubmit', this.state.query)}
        value={this.state.query}
      >
        {mapResultsDataToComponents(this.state.results)}
      </QuickSearch>
    );
  }
}

export default () => (
  <Navigation
    drawers={[
      <AkSearchDrawer
        backIcon={null}
        isOpen
        key="search"
        onBackButton={noop}
        primaryIcon={null}
      >
        <BasicQuickSearch />
      </AkSearchDrawer>,
    ]}
  />
);
