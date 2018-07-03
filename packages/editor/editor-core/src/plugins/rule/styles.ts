// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { akEditorRuleBackground, akEditorRuleBorderRadius } from '../../styles';

export const ruleStyles = css`
  .ProseMirror hr {
    height: 0;
    border: 1px solid ${akEditorRuleBackground};
    border-radius: ${akEditorRuleBorderRadius};
    margin: 24px 0;
  }
`;
