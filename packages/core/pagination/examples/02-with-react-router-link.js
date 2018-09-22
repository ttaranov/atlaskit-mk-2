//@flow
import React, { Component, Fragment } from 'react';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import Button from '@atlaskit/button';
import Pagination from '../src';

const pages = [
  {
    link: '/',
    label: '1',
  },
  {
    link: '/about',
    label: '2',
  },
  {
    link: '/contact',
    label: '3',
  },
];

const Dashboard = () => (
  <div>
    <h1>This is dashboard</h1>
    <PaginationWithSelectPage pageSelected={0} />
  </div>
);
const About = () => (
  <div>
    <h1>This is about</h1>
    <PaginationWithSelectPage pageSelected={1} />
  </div>
);
const Contact = () => (
  <div>
    <h1>This is contact</h1>
    <PaginationWithSelectPage pageSelected={2} />
  </div>
);

const PaginationWithSelectPage = ({
  pageSelected,
}: {
  pageSelected: number,
}) => (
  <Pagination>
    {(LeftNavigator, AKLink, RightNavigator) => (
      <Fragment>
        {pageSelected !== 0 ? (
          <Link to={pageSelected === 0 ? '' : pages[pageSelected - 1].link}>
            <LeftNavigator />
          </Link>
        ) : (
          <LeftNavigator isDisabled />
        )}
        {pages.map((page, index) => (
          <Link to={page.link} key={index}>
            <AKLink selected={pageSelected === index}>{page.label}</AKLink>
          </Link>
        ))}
        {pageSelected !== 2 ? (
          <Link to={pageSelected === 2 ? '' : pages[pageSelected + 1].link}>
            <RightNavigator />
          </Link>
        ) : (
          <RightNavigator isDisabled />
        )}
      </Fragment>
    )}
  </Pagination>
);

export default class WithReactRouterLink extends Component<{}> {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/" isExact component={Dashboard} />
        </Switch>
      </HashRouter>
    );
  }
}
