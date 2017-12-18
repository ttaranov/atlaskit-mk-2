const i18n = {
  'en-au': {
    error: {
      title: 'Error text',
      description: 'Error description',
    },
    noaccess: {
      title: 'Well, this is awkward...',
      description:
        "You don't have access to these pages. Please speak to your site admin for help.",
    },
    empty: {
      title: "There's nothing here but potential",
      description:
        'Create some meeting notes, product requirements, decisions, or other content to see this space fill up.',
    },
    create: 'Create Page',
    tableHeaderTitle: 'Title',
    tableHeaderContributors: 'Contributors',
    tableHeaderLastModified: 'Last Modified',
    viewProfile: 'View Profile',
  },
};

function getI18n(lang = 'en-au') {
  return i18n[lang];
}

export { getI18n };
