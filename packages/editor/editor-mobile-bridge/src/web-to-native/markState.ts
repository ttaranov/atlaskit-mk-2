export class MarkState {
  name: string;
  active: boolean;
  enabled: boolean;
}

export function valueOf(state): MarkState[] {
  let states: MarkState[] = [
    {
      name: 'strong',
      active: state.strongActive,
      enabled: !state.strongDisabled,
    },
    {
      name: 'em',
      active: state.emActive,
      enabled: !state.emDisabled,
    },
    {
      name: 'code',
      active: state.codeActive,
      enabled: !state.codeDisabled,
    },
    {
      name: 'underline',
      active: state.underlineActive,
      enabled: !state.underlineDisabled,
    },
    {
      name: 'strike',
      active: state.strikeActive,
      enabled: !state.strongDisabled,
    },
    {
      name: 'sup',
      active: state.superscriptActive,
      enabled: !state.superscriptDisabled,
    },
    {
      name: 'sub',
      active: state.subscriptActive,
      enabled: !state.subscriptDisabled,
    },
  ];
  return states;
}
