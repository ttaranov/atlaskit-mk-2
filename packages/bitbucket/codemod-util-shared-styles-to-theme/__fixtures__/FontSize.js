// @flow
import { akFontSizeDefault as fontSize } from "@atlaskit/util-shared-styles";
import { colors } from "@atlaskit/theme";
import styled from "styled-components";

export const SourceLine = styled.td`
  background-color: ${colors.N0};
  font-size: ${fontSize};
  vertical-align: top;
`;
//////
// @flow
import { colors, fontSize } from "@atlaskit/theme";
import styled from "styled-components";

export const SourceLine = styled.td`
  background-color: ${colors.N0};
  font-size: ${fontSize() + "px"};
  vertical-align: top;
`;