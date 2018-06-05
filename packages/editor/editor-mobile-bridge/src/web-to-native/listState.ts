export class ListState {
  name: string;
  active: boolean;
  enabled: boolean;
}

export function valueOf(state): ListState[] {
  let states: ListState[] = [
    {
      name: 'bullet',
      active: state.bulletListActive,
      enabled: !state.bulletListDisabled,
    },
    {
      name: 'ordered',
      active: state.orderedListActive,
      enabled: !state.orderedListDisabled,
    },
  ];
  return states;
}
