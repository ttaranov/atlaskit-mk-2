// @flow
import React, { type Element } from 'react';
import Button from '@atlaskit/button';

import { Actions, ActionItems, ActionItem } from '../styled/Dialog';
import type { ActionsType } from '../types';

type Props = {|
  /** An optional element rendered beside the actions */
  beforeElement?: Element<*>,
  /** Buttons to render */
  items: ActionsType,
|};

// NOTE: create the function once, rather than inside each render
// eslint-disable-next-line react/prop-types
const renderButtonsMap = ({ text, ...rest }, idx) => (
  <ActionItem key={text || idx}>
    <Button {...rest}>{text}</Button>
  </ActionItem>
);

// NOTE: The span is used to force flex behaviour "space-between" when no
// `beforeElement` is supplied, pushing the buttons to the correct side.
// beforeElement: <span />,

const SpotLightActions = ({ beforeElement = <span />, items }: Props) => (
  <Actions>
    {beforeElement}
    <ActionItems>{items.map(renderButtonsMap)}</ActionItems>
  </Actions>
);

export default SpotLightActions;
