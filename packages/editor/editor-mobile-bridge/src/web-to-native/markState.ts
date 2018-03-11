export class MarkState {
  markName: string;
  active: boolean;
  enabled: boolean;
}

export function valueOf(state): MarkState[] {
  let states: MarkState[] = [
    {
      markName: 'strong',
      active: state.strongActive,
      enabled: !state.strongDisabled,
    },
    {
      markName: 'em',
      active: state.emActive,
      enabled: !state.emDisabled,
    },
    {
      markName: 'code',
      active: state.codeActive,
      enabled: !state.codeDisabled,
    },
    {
      markName: 'underline',
      active: state.underlineActive,
      enabled: !state.underlineDisabled,
    },
    {
      markName: 'strike',
      active: state.strikeActive,
      enabled: !state.strongDisabled,
    },
    {
      markName: 'sup',
      active: state.superscriptActive,
      enabled: !state.superscriptDisabled,
    },
    {
      markName: 'sub',
      active: state.subscriptActive,
      enabled: !state.subscriptDisabled,
    },
  ];
  return states;
}
