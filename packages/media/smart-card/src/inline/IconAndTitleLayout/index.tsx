import * as React from 'react';
import { IconWrapper, TitleWrapper, OtherWrapper } from './styled';

export interface IconAndTitleLayoutProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  right?: React.ReactNode;
  isSelected?: boolean;
}

export class IconAndTitleLayout extends React.Component<
  IconAndTitleLayoutProps
> {
  render() {
    const { icon, title, isSelected, children } = this.props;
    return (
      <>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <TitleWrapper isSelected={isSelected}>{title}</TitleWrapper>
        {children && <OtherWrapper>{children}</OtherWrapper>}
      </>
    );
  }
}
