import { ComponentClass } from 'react';
import { Mark } from 'prosemirror-model';

import Code from './code';
import Em from './em';
import Link from './link';
import Strike from './strike';
import Strong from './strong';
import Subsup from './subsup';
import TextColor from './textColor';
import Underline from './underline';

export const markToReact = {
  'code': Code,
  'em': Em,
  'link': Link,
  'strike': Strike,
  'strong': Strong,
  'subsup': Subsup,
  'textColor': TextColor,
  'underline': Underline,
};

export const toReact = (mark: Mark): ComponentClass<any> => {
  return markToReact[mark.type.name];
};

export {
  Code,
  Em,
  Link,
  Strike,
  Strong,
  Subsup,
  TextColor,
  Underline,
};
