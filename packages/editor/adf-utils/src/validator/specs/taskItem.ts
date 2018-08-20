export default {
  props: {
    type: { type: 'enum', values: ['taskItem'] },
    content: { type: 'array', items: ['inline'] },
    attrs: {
      props: {
        localId: { type: 'string' },
        state: { type: 'enum', values: ['TODO', 'DONE'] },
      },
    },
  },
};
