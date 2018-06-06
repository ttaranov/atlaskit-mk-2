// @flow
import { akGridSizeUnitless as gridSize } from "@atlaskit/util-shared-styles";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";

const blah = gridSize;
const MyDiv = styled.div`
  padding: ${gridSize}px;
`;
//////
// @flow
import styled from "styled-components";
import { colors, gridSize } from "@atlaskit/theme";

const blah = gridSize();
const MyDiv = styled.div`
  padding: ${gridSize()}px;
`;
