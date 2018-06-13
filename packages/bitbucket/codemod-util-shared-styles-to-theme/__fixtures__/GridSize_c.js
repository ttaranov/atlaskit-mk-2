// @flow
import {
  akGridSizeUnitless,
  akTypographyMixins
} from "@atlaskit/util-shared-styles";
import styled from "styled-components";

export const EventContainer = styled.div`
  display: flex;
  margin-bottom: ${akGridSizeUnitless * 2}px;
`;
//////
// @flow
import { gridSize, typography } from "@atlaskit/theme";
import styled from "styled-components";

export const EventContainer = styled.div`
  display: flex;
  margin-bottom: ${gridSize() * 2}px;
`;
