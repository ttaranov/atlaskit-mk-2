// @flow
import IssueIcon from "@atlaskit/icon/glyph/issue";
import { akBorderRadius } from "@atlaskit/util-shared-styles";
import styled from "styled-components";

const MyDiv = styled.p`
  border-radius: ${akBorderRadius};
`;

//////
// @flow
import IssueIcon from "@atlaskit/icon/glyph/issue";
import { borderRadius } from "@atlaskit/theme";
import styled from "styled-components";

const MyDiv = styled.p`
  border-radius: ${`${borderRadius()}px`};
`;
