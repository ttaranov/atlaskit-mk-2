// @flow
import React from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import Button from '../src';

type Props = {
  children: Node,
  className: string,
  href: Link,
  onMouseEnter: Event,
  onMouseLeave: Event,
};
class RouterLink extends React.PureComponent<Props, {}> {
  render() {
    const {
      children,
      className,
      href,
      onMouseEnter,
      onMouseLeave,
    } = this.props;

    return (
      <Link
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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
