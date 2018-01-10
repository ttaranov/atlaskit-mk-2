// @flow
import React, { PureComponent } from 'react';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import { AkSearch, AkNavigationItem } from '../../src/';

import data, { type SearchResult } from './example-data';

const icons = {
  'CSI actors': <AtlassianIcon label="CSI" />,
  'Fictional swords': <DashboardIcon label="Fictional swords" />,
};

function contains(string, query) {
  return string.toLowerCase().indexOf(query.toLowerCase()) > -1;
}

function searchData(query): Array<SearchResult> {
  const results = data
    .map(({ group, items }) =>
      items
        .filter(item => contains(item.name, query) || contains(group, query))
        .map(item => ({
          group,
          item,
        })),
    )
    .reduce((a, b) => a.concat(b));
  return results;
}

// a little fake store for holding the query after a component unmounts
const store = {};

type Props = {
  fakeNetworkLatency: number,
};

type State = {
  query: string,
  results: Array<SearchResult>,
  isLoading: boolean,
};

export default class BasicSearch extends PureComponent<Props, State> {
  static defaultProps = {
    fakeNetworkLatency: 0,
  };

  state = {
    query: store.query || '',
    results: searchData(''),
    isLoading: false,
  };

  setQuery(query: string) {
    store.query = query;
    this.setState({
      query,
    });
  }

  search = (query: string) => {
    let searchTimeoutFn;
    clearTimeout(searchTimeoutFn);
    this.setState({
      isLoading: true,
    });
    this.setQuery(query);
    const results = searchData(query);
    searchTimeoutFn = setTimeout(() => {
      this.setState({
        results,
        isLoading: false,
      });
    }, this.props.fakeNetworkLatency);
  };

  renderResults = () =>
    this.state.results.map(({ item, group }, idx) => (
      <AkNavigationItem
        href="#foo"
        icon={icons[group]}
        subText={group}
        text={item.name}
        caption={item.caption}
        key={idx}
      />
    ));

  render() {
    return (
      <AkSearch
        clearIcon={<CrossIcon label="clear" size="medium" />}
        onInput={({ target }) => {
          this.search(target.value);
        }}
        value={this.state.query}
        isLoading={this.state.isLoading}
        onKeyDown={() => {}}
      >
        {this.renderResults()}
      </AkSearch>
    );
  }
}
