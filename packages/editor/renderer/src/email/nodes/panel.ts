import {
  akBorderRadius,
  akColorB400,
  akColorB50,
  akColorG400,
  akColorG50,
  akColorP50,
  akColorP400,
  akColorY400,
  akColorY50,
  akColorR50,
  akColorR400,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';

import { NodeSerializerOpts } from '../interfaces';
import { createTag, serializeStyle } from '../util';

const config = {
  info: {
    background: akColorB50,
    iconColor: akColorB400,
  },
  note: {
    background: akColorP50,
    iconColor: akColorP400,
  },
  tip: {
    background: akColorG50,
    iconColor: akColorG400,
  },
  success: {
    background: akColorG50,
    iconColor: akColorG400,
  },
  warning: {
    background: akColorY50,
    iconColor: akColorY400,
  },
  error: {
    background: akColorR50,
    iconColor: akColorR400,
  },
};

export default function panel({ attrs, text }: NodeSerializerOpts) {
  const css = serializeStyle({
    'border-radius': akBorderRadius,
    margin: `${akGridSizeUnitless / 2}px 0`,
    padding: `${akGridSizeUnitless}px`,
    background: config[attrs.panelType] && config[attrs.panelType].background,
  });

  return createTag('div', { style: css }, text);
}
