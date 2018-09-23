import * as React from 'react';
import { ReactNode } from 'react';
import { Wrapper, Title, Body, Icon, Subtitle } from './styled';

export interface InfoViewProps {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  isLink?: boolean;
  isLoading?: boolean;
}

export class InfoView extends React.Component<InfoViewProps, {}> {
  get hasTitle(): Boolean {
    const { title, isLoading } = this.props;
    return Boolean(title) || Boolean(isLoading);
  }

  get hasBody(): Boolean {
    const { icon, subtitle, isLoading } = this.props;
    return Boolean(icon) || Boolean(subtitle) || Boolean(isLoading);
  }

  get valign(): 'top' | 'bottom' | undefined {
    if (this.hasTitle && this.hasBody) {
      return undefined;
    } else if (this.hasTitle) {
      return 'top';
    } else if (this.hasBody) {
      return 'bottom';
    }

    return undefined;
  }

  render() {
    const { title, subtitle, icon, isLink, isLoading } = this.props;
    return (
      <Wrapper valign={this.valign}>
        {this.hasTitle && <Title className="title">{title}</Title>}
        {this.hasBody && (
          <Body>
            {!isLoading && icon ? <Icon>{icon}</Icon> : null}
            <Subtitle isLink={isLink} className="subtitle">
              {subtitle}
            </Subtitle>
          </Body>
        )}
      </Wrapper>
    );
  }
}
