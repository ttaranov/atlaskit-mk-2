import * as React from 'react';
import styled from 'styled-components';
import { akColorB300, akColorB400, akBorderRadius } from '@atlaskit/util-shared-styles';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';
import { hexToRgba } from '../../utils/color';

import { MEDIA_HEIGHT, FILE_WIDTH } from './MediaComponent';


// tslint:disable-next-line:variable-name
const IconWrapper = styled.div`
  color: ${hexToRgba(akColorB400, 0.4) || ''};
  background: ${hexToRgba(akColorB300, 0.6) || ''};
  border-radius: ${akBorderRadius};
  margin: 5px 3px 25px;
  width: ${FILE_WIDTH}px;
  min-height: ${MEDIA_HEIGHT}px;
  display: flex;
  align-content: center;
  justify-content: center;
`;

export default () => (
  <IconWrapper>
    <DocumentFilledIcon label="Document" />
  </IconWrapper>
);
