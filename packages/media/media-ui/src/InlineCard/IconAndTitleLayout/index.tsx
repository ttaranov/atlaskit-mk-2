import * as React from 'react';
import { IconWrapper, OtherWrapper } from './styled';

export interface IconAndTitleLayoutProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  right?: React.ReactNode;
}

export class IconAndTitleLayout extends React.Component<
  IconAndTitleLayoutProps
> {
  render() {
    const { icon, title, children } = this.props;
    return (
      <>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        {title}
        {children && <OtherWrapper>{children}</OtherWrapper>}
      </>
    );
  }
}
