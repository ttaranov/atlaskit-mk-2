// @flow
import { akGridSize, akGridSizeUnitless } from "@atlaskit/util-shared-styles";
import styled from "styled-components";
const padding = akGridSize; // "8px"
const padding2 = akGridSizeUnitless; // 8
//////
// @flow
import { gridSize } from "@atlaskit/theme";
import styled from "styled-components";
const padding = `${gridSize()}px`; // "8px"
const padding2 = gridSize(); // 8
