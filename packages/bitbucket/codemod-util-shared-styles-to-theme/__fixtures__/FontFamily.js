// @flow
import { akFontFamily as font } from "@atlaskit/util-shared-styles";
import { colors } from "@atlaskit/theme";
import styled from "styled-components";

export const SourceLine = styled.td`
  background-color: ${colors.N0};
  font-family: ${font};
  vertical-align: top;
`;
//////
// @flow
import { colors, fontFamily } from "@atlaskit/theme";
import styled from "styled-components";

export const SourceLine = styled.td`
  background-color: ${colors.N0};
  font-family: ${fontFamily()};
  vertical-align: top;
`;
