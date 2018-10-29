import * as React from 'react';
import { Link } from './WrappedLink';
import Button from '@atlaskit/button';

export type LinkButtonProps = {
  to: string;
  children: React.ReactNode;
};

export default function LinkButton({ to, children }: LinkButtonProps) {
  return (
    <Button
      component={props => {
        return (
          <Link to={to} {...props}>
            {children}
          </Link>
        );
      }}
    />
  );
}
