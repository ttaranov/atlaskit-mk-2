import * as React from 'react';
import Lozenge from '@atlaskit/lozenge';

import { IconWithTooltip, LozengeViewModel } from '../CardView/ViewModel';
import { A, Img, Text, LozengeWrapper } from './styled';

export interface AnchorWithTooltip {
  href: string;
  title: string;
}

export interface Props {
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

export function InlineCardView(props: Props) {
  const { link, icon, text, lozenge } = props;

  return (
    <A href={link.href} title={link.title}>
      {renderIcon(icon)}
      <Text>{text}</Text>
      {renderLozenge(lozenge)}
    </A>
  );
}
