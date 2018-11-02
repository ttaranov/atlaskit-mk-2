/**
 * Once copy is finalised, these message objects should be wrapped in a call to react-intl::defineMessages()
 * This makes them visible to the i18n pipeline where they'll receive translations from Transifex.
 */

export const commonMessages = {
  deactivateAccount: {
    id: 'focused-task-close-account.deactivate-account',
    defaultMessage: 'Deactivate account',
    description:
      'Text that appears in a button, link or heading for the action of deactivating an account',
  },

  deleteAccount: {
    id: 'focused-task-close-account.delete-account',
    defaultMessage: 'Delete account',
    description:
      'Text that appears in a button, link or heading for the action of deleting an account',
  },

  learnMore: {
    id: 'focused-task-close-account.learnMore',
    defaultMessage: 'Learn more',
    description:
      'Text for a link to a page where a user can learn more about a particular topic',
  },

  cancel: {
    id: 'focused-task-close-account.cancel',
    defaultMessage: 'Cancel',
    description:
      'Text for a button for a user to cancel the current task/process',
  },

  next: {
    id: 'focused-task-close-account.next',
    defaultMessage: 'Next',
    description:
      'Text for a button for a user to proceed to the next step of a process',
  },

  previous: {
    id: 'focused-task-close-account.previous',
    defaultMessage: 'Previous',
    description:
      'Text for a button for a user to go back to the previous step of a process',
  },
};

export const overviewMessages = {
  heading: {
    id: 'focused-task-close-account.delete-account.overview.heading',
    defaultMessage: 'What deleting an account means',
    description:
      "Heading for the screen that explains what happens when a user's account is deleted",
  },

  warningSectionBody: {
    id:
      'focused-task-close-account.delete-account.overview.warning-section.body',
    defaultMessage:
      "You can't undo deleting an account. If you think you'll need the account later, deactivate it instead.",
    description:
      'A warning message shown to users when they try to delete their account.',
  },

  paragraphAboutToDeleteAdmin: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.about-to-delete.admin',
    defaultMessage: "You're about to delete a user's account, which means:",
    description:
      'A paragraph explaining that the admin is about to delete another user',
  },
  paragraphAboutToDeleteSelf: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.about-to-delete.self',
    defaultMessage: "You're about to delete your account, which means:",
    description:
      'A paragraph explaining that user is about to delete their own account',
  },

  paragraphLoseAccessAdmin: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.loseAccess.admin',
    defaultMessage:
      'They will immediately lose access to all Atlassian services. {fullName} currently has access to:',
    description:
      'A paragraph explaining that upon deletion the user will lose access to certain services. The second sentence is to begin a list of services the user-to-be-deleted can currently access. {fullName} is filled in by the web app.',
  },
  paragraphLoseAccessSelf: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.loseAccess.self',
    defaultMessage:
      'You will immediately lose access to all Atlassian services. You currently have access to:',
    description:
      'A paragraph explaining that upon deletion the user will lose access to certain services. The second sentence is to begin a list of services the user-to-be-deleted can currently access.',
  },

  paragraphLoseAccessAdminNoSites: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.loseAccess.admin.noSites',
    defaultMessage:
      'They will immediately lose access to all Atlassian services.',
    description:
      'A paragraph explaining that upon deletion the user will lose access to certain services. The second sentence is to begin a list of services the user-to-be-deleted can currently access. {fullName} is filled in by the web app.',
  },
  paragraphLoseAccessSelfNoSites: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.loseAccess.self.noSites',
    defaultMessage:
      'You will immediately lose access to all Atlassian services.',
    description:
      'A paragraph explaining that upon deletion the user will lose access to certain services. The second sentence is to begin a list of services the user-to-be-deleted can currently access.',
  },

  paragraphLoseAccessFootnoteAdmin: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.loseAccess.footnote.admin',
    defaultMessage:
      'They might also have access to other services, such as {atlassianCommunity}',
    description:
      "A paragraph explaining that upon deletion the user may also lose access to services that weren't listed prior.",
    values: {
      atlassianCommunity: 'Atlassian Commnuity',
    },
  },
  paragraphLoseAccessFootnoteSelf: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.loseAccess.footnote.self',
    defaultMessage:
      'You might also have access to other services, such as {atlassianCommunity}',
    description:
      "A paragraph explaining that upon deletion the user may also lose access to services that weren't listed prior.",
    values: {
      atlassianCommunity: 'Atlassian Commnuity',
    },
  },

  paragraphContentCreatedAdmin: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.content-created.admin',
    defaultMessage:
      "The content they've created will remain in Atlassian services",
    description:
      "A paragraph explaining that although the user's details will be deleted, content they have created will remain.",
  },
  paragraphContentCreatedSelf: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.content-created.self',
    defaultMessage:
      "The content you've created will remain in Atlassian services",
    description:
      "A paragraph explaining that although the user's details will be deleted, content they have created will remain.",
  },

  inlineDialogContentCreatedAdmin: {
    id:
      'focused-task-close-account.delete-account.overview.inline-dialog.content-created.admin',
    defaultMessage:
      "For example, pages, issues, and comments they've created in products.",
    description:
      'Examples of what constitutes as created content. Appears when the user hovers over the info icon',
  },
  inlineDialogContentCreatedSelf: {
    id:
      'focused-task-close-account.delete-account.overview.inline-dialog.content-created.self',
    defaultMessage:
      "For example, pages, issues, and comments you've created in products.",
    description:
      'Examples of what constitutes as created content. Appears when the user hovers over the info icon',
  },

  paragraphPersonalDataWillBeDeletedAdmin: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.personal-data-will-be-deleted.admin',
    defaultMessage:
      'Their personal data (their full name, email address, etc) will be deleted from Atlassian sites and products.',
    description:
      "A paragraph explaining what parts of the user's personal data will be deleted",
  },
  paragraphPersonalDataWillBeDeletedSelf: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.personal-data-will-be-deleted.self',
    defaultMessage:
      'Your personal data (full name, email address, etc) will be deleted from Atlassian sites and products.',
    description:
      "A paragraph explaining what parts of the user's personal data will be deleted",
  },

  paragraphPersonalDataWillBeDeletedFootnote: {
    id:
      'focused-task-close-account.delete-account.overview.paragraph.personal-data-will-be-deleted.footnote',
    defaultMessage: 'We keep some personal data for legal purposes.',
    description:
      'A note explaining that some personal data is required to be saved from deletion for legal purposes.',
  },

  inlineDialogDataWillBeDeletedP1Admin: {
    id:
      'focused-task-close-account.delete-account.overview.inline-dialog.personal-data-will-be-deleted.p1.admin',
    defaultMessage:
      "We keep some personal data for the purposes of legal claims or for other legitimate interests. We might need this data if the user requests a service or we need to comply with a legal obligation. For example, if the user is a billing administrator, we're required to retain their name and purchase history for financial reporting and auditing.",
    description:
      'Text elaborating on the note that some personal data is required to be saved from deletion for legal purposes.',
  },
  inlineDialogDataWillBeDeletedP1Self: {
    id:
      'focused-task-close-account.delete-account.overview.inline-dialog.personal-data-will-be-deleted.p1.self',
    defaultMessage:
      "We keep some personal data for the purposes of legal claims or for other legitimate interests. We might need this data you request a service or we need to comply with a legal obligation. For example, if you are a billing administrator, we're required to retain your name and purchase history for financial reporting and auditing.",
    description:
      'Text elaborating on the note that some personal data is required to be saved from deletion for legal purposes.',
  },

  inlineDialogDataWillBeDeletedP2Admin: {
    id:
      'focused-task-close-account.delete-account.overview.inline-dialog.personal-data-will-be-deleted.p2.admin',
    defaultMessage:
      'Users have the right to submit complaints to a supervisory authority.',
    description:
      'Text elaborating on the note that some personal data is required to be saved from deletion for legal purposes.',
  },
  inlineDialogDataWillBeDeletedP2Self: {
    id:
      'focused-task-close-account.delete-account.overview.inline-dialog.personal-data-will-be-deleted.p2.self',
    defaultMessage:
      'You have the right to submit complaints to a supervisory authority.',
    description:
      'Text elaborating on the note that some personal data is required to be saved from deletion for legal purposes.',
  },
};

export const contentPreviewMessages = {
  heading: {
    id: 'focused-task-close-account.delete-account.content-preview.heading',
    defaultMessage: 'How users will see this account',
    description:
      'Heading for the screen that explains what other users will see when viewing the deleted/deactivated user',
  },
};
