//@flow
import React, { Component, Fragment } from 'react';
import Pagination, { collapseRange } from '../src';

const MAX_NUMBER_OF_PAGES = 7;

type State = {
  items: Array<{ link: string, value: number }>,
  selected: number,
};

export default class extends Component<{}, State> {
  state = {
    items: pageLinks,
    selected: 1,
  };

  onArrowClicked = (direction: string) => {
    console.log(direction);
    if (direction === 'previous') {
      this.setState({
        selected: this.state.selected - 1,
      });
    } else {
      this.setState({
        selected: this.state.selected + 1,
      });
    }
  };

  updateTheSelected = (newPage: number) => {
    console.log(newPage);
    this.setState({
      selected: newPage,
    });
  };

  render() {
    let pageLinksCollapsed = collapseRange(
      MAX_NUMBER_OF_PAGES,
      this.state.selected,
      this.state.items,
    );
    const { selected } = this.state;
    const firstPage = pageLinksCollapsed[0];
    const lastPage = pageLinksCollapsed[pageLinksCollapsed.length - 1];
    return (
      <Pagination>
        {(LeftNavigator, Link, RightNavigator) => (
          <Fragment>
            <LeftNavigator
              isDisabled={firstPage.value === selected}
              onChange={this.onArrowClicked}
            />
            {pageLinksCollapsed.map((pageLink, index) => {
              if (pageLink === '...') {
                return <span key={index}>...</span>;
              }
              let { value, link } = pageLink;
              return (
                <Link
                  key={index}
                  onClick={() => {
                    this.updateTheSelected(value);
                  }}
                  selected={value === this.state.selected}
                >
                  {value}
                </Link>
              );
            })}
            <RightNavigator
              isDisabled={lastPage.value === selected}
              onChange={this.onArrowClicked}
            />
          </Fragment>
        )}
      </Pagination>
    );
  }
}

const pageLinks: Array<{ link: string, value: number }> = [
  {
    link: '#hello',
    value: 1,
  },
  {
    link: '#hello',
    value: 2,
  },
  {
    link: '#hello',
    value: 3,
  },
  {
    link: '#hello',
    value: 4,
  },
  {
    link: '#hello',
    value: 5,
  },
  {
    link: '#hello',
    value: 6,
  },
  {
    link: '#hello',
    value: 7,
  },
  {
    link: '#hello',
    value: 8,
  },
  {
    link: '#hello',
    value: 9,
  },
  {
    link: '#hello',
    value: 10,
  },
  {
    link: '#hello',
    value: 11,
  },
  {
    link: '#hello',
    value: 12,
  },
  {
    link: '#hello',
    value: 13,
  },
];
