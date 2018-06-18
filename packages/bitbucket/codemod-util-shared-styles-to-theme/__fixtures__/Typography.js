// @flow
import { akTypographyMixins as typo } from "@atlaskit/util-shared-styles";
import styled from "styled-components";
const VariousSizes = styled.div`
  ${typo.h100};
  ${typo.h200};
  ${typo.h300};
  ${typo.h400};
  ${typo.h500};
  ${typo.h600};
  ${typo.h700};
  ${typo.h800};
  ${typo.h900};
`;
//////
// @flow
import { typography } from "@atlaskit/theme";
import styled from "styled-components";
const VariousSizes = styled.div`
  ${typography.h100()};
  ${typography.h200()};
  ${typography.h300()};
  ${typography.h400()};
  ${typography.h500()};
  ${typography.h600()};
  ${typography.h700()};
  ${typography.h800()};
  ${typography.h900()};
`;
