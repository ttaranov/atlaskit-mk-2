// @flow
import { akCodeFontFamily as codeFont } from "@atlaskit/util-shared-styles";
import { colors } from "@atlaskit/theme";
import styled from "styled-components";

export const SourceLine = styled.td`
  background-color: ${colors.N0};
  font-family: ${codeFont};
  vertical-align: top;
`;
//////
// @flow
import { colors, codeFontFamily } from "@atlaskit/theme";
import styled from "styled-components";

export const SourceLine = styled.td`
  background-color: ${colors.N0};
  font-family: ${codeFontFamily()};
  vertical-align: top;
`;
