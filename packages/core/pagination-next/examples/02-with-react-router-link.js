//@flow
import React, { Fragment } from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import Pagination from '../src';

const pages = [
  {
    link: '/dashboard',
    label: 'dashboard',
  },
  {
    link: '/about',
    label: 'about',
  },
  {
    link: '/contact',
    label: 'contact',
  },
];

const Dashboard = () => <h1>This is dashboard</h1>;
const About = () => <h1>This is about</h1>;
const Contact = () => <h1>This is contact</h1>;

export default () => (
  <BrowserRouter>
    <div>
      <Pagination>
        {(LeftNavigator, AKLink, RightNavigator) => (
          <Fragment>
            <LeftNavigator>
              {() => <Link to="/dashboard">Dashboard</Link>}
            </LeftNavigator>
            {pages.map((page, index) => (
              <AKLink key={index}>
                <Link to={page.link}>{page.label}</Link>
              </AKLink>
            ))}
            <RightNavigator>
              {() => <Link to="/contact">contact</Link>}
            </RightNavigator>
          </Fragment>
        )}
      </Pagination>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
    </div>
  </BrowserRouter>
);
