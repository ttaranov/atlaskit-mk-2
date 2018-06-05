import * as React from 'react';
import { Frame } from '../Frame';
import Lozenge from '@atlaskit/lozenge';
import { LozengeViewModel } from '../../block/CardView/ViewModel';
import { Icon, Link, LozengeWrapper } from './styled';

export interface ResolvedViewProps {
  icon?: string;
  text: string;
  lozenge?: LozengeViewModel;
  isSelected?: boolean;
  onClick?: () => void;
}

export class ResolvedView extends React.Component<ResolvedViewProps> {
  renderIcon() {
    const { icon } = this.props;
    if (!icon) {
      return null;
    }
    return <Icon src={icon} />;
  }

  renderLozenge() {
    const { lozenge } = this.props;
    if (!lozenge) {
      return null;
    }
    return (
      <LozengeWrapper>
        <Lozenge
          appearance={lozenge.appearance || 'default'}
          isBold={lozenge.isBold}
        >
          {lozenge.text}
        </Lozenge>
      </LozengeWrapper>
    );
  }

  render() {
    const { text, isSelected, onClick } = this.props;
    return (
      <Frame isSelected={isSelected} onClick={onClick}>
        {this.renderIcon()}
        <Link isSelected={isSelected}>{text}</Link>
        {this.renderLozenge()}
      </Frame>
    );
  }
}
