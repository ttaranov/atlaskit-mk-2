// @flow

import React from 'react';
import styled from 'styled-components';

import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import UnderlineIcon from '@atlaskit/icon/glyph/editor/underline';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import NumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import CodeIcon from '@atlaskit/icon/glyph/editor/code';

import Tooltip from '../src/';

const Toolbar = styled.div`
  display: flex;
`;
const Action = styled.div`
  border-radius: 3px;
  margin-right: 3px;
  height: 24px;
  width: 24px;

  &:hover {
    background-color: #eee;
  }
`;

const ACTIONS = {
  bold: <BoldIcon label="Bold" />,
  italic: <ItalicIcon label="Italic" />,
  underline: <UnderlineIcon label="Underline" />,
  link: <LinkIcon label="Link" />,
  'bullet list': <BulletListIcon label="Bullet List" />,
  'number list': <NumberListIcon label="Number List" />,
  source: <CodeIcon label="Source" />,
};

export default function WysiwygExample() {
  return (
    <Toolbar>
      {Object.keys(ACTIONS).map(a => (
        <Tooltip content={a} placement="top">
          <Action>{ACTIONS[a]}</Action>
        </Tooltip>
      ))}
    </Toolbar>
  );
}
