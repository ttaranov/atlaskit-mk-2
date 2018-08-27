export default {
  props: {
    type: { type: 'enum', values: ['decisionItem'] },
    content: { type: 'array', items: ['inline'] },
    attrs: {
      props: { localId: { type: 'string' }, state: { type: 'string' } },
    },
  },
};
