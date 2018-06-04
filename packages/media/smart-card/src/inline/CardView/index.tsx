import * as React from 'react';
import Lozenge from '@atlaskit/lozenge';

import {
  IconWithTooltip,
  LozengeViewModel,
} from '../../block/CardView/ViewModel';
import { A, Img, LozengeWrapper } from './styled';

export interface AnchorWithTooltip {
  href: string;
  title: string;
}

export interface CardViewProps {
  link: AnchorWithTooltip;
  icon?: IconWithTooltip;
  text: string;
  lozenge?: LozengeViewModel;
}

const renderIcon = (icon?: IconWithTooltip) => {
  if (icon === undefined) {
    return;
  }

  return <Img src={icon.url} alt={icon.tooltip} />;
};

const renderLozenge = (lozenge?: LozengeViewModel) => {
  if (lozenge === undefined) {
    return;
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
};

export function CardView(props: CardViewProps) {
  const { link, icon, text, lozenge } = props;
  return (
    <A href={link.href} title={link.title}>
      {renderIcon(icon)}
      {text}
      {renderLozenge(lozenge)}
    </A>
  );
}
