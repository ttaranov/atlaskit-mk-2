export const components = [
  {
    core: [
      'Analytics next',
      'Analytics',
      'Avatar group',
      'Avatar',
      'Badge',
      'Banner',
      'Blanket',
      'Breadcrumbs',
      'Button',
      'Calendar',
      'Checkbox',
      'Code',
      'Comment',
      'Datetime picker',
      'Drawer',
      'Dropdown menu',
      'Droplist',
      'Dynamic table',
      'Empty state',
      'Feedback collector',
      'Field-radio-group',
      'Field-range',
      'Field-text area',
      'Field-text',
      'Flag',
      'Form',
      'Global navigation',
      'Icon',
      'Inline dialog',
      'Inline edit',
      'Inline message',
      'Layer manager',
      'Logo',
      'Lozenge',
      'Modal dialog',
      'Navigation next',
      'Navigation',
      'Nps',
      'Onboarding',
      'Page header',
      'Page',
      'Pagination',
      'Portal',
      'Progress indicator',
      'Progress tracker',
      'Radio',
      'Section message',
      'Select',
      'Size detector',
      'Spinner',
      ,
      'Table tree',
      'Tabs',
      'Tag group',
      'Tag',
      'Theme',
      'Toggle',
      'Tooltip',
      'Tree',
    ],
  },
  {
    'css-packs': ['css-packs', 'reduced-ui-pack'],
  },
  {
    editor: [
      'Conversation',
      'Editor bitbucket transformer',
      ,
      'Editor confluence transformer',
      ,
      'Editor core',
      ,
      'Editor jira transformer',
      ,
      'Editor json transformer',
      ,
      'Editor markdown transformer',
      ,
      'Editor wikimarkup transformer',
      ,
      'Renderer',
    ],
  },
  {
    elements: [
      'Date',
      'Emoji',
      'Mention',
      'Pubsub',
      'Reactions',
      'Status',
      'Task decision',
    ],
  },
  {
    growth: ['Feature flag client', 'React experiment framework'],
  },
  {
    home: ['Notification indicator', 'Notification log client'],
  },
  {
    media: [
      'Media avatar picker',
      'Media card',
      'Media core',
      'Media editor',
      'Media filmstrip',
      'Media image',
      'Media picker',
      'Media ui',
      'Media viewer',
      'Smart card',
    ],
  },
  {
    'people-and-teams': ['Profilecard'],
  },
  {
    search: ['Global search', 'Quick search'],
  },
  {
    bitbucket: ['Mobile header'],
  },
];

export const getUrls = (group, components) => {
  let urls = [];
  components.forEach(element => {
    if (element[group]) {
      element[group].forEach(pkg => {
        let url = `https://atlaskit.atlassian.com/packages/${group}/${pkg
          .replace(' ', '-')
          .toLowerCase()}`;
        urls.push(url);
      });
    }
  });
  return urls;
};
