// @flow
import React from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import Button from '../src';

class RouterLink extends React.PureComponent {
  render() {
    const { href, children, onMouseDown, onClick, className } = this.props;

    return (
      <Link
        className={className}
        onMouseDown={onMouseDown}
        onClick={onClick}
        to={href}
      >
        {children}
      </Link>
    );
  }
}

const ButtonWithRouter = () => (
  <div>
    <MemoryRouter>
      <Button appearance="subtle-link" href="/" component={RouterLink}>
        Button Using Routing
      </Button>
    </MemoryRouter>
  </div>
);

export default ButtonWithRouter;
