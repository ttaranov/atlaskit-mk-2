import React, { Component } from 'react';
import { mount, shallow, render } from 'enzyme';

import { name } from '../../package.json';
import * as bundle from '../../src';
import { size } from '../../src/components/Icon';

import components from '../../docs/icons';

describe(name, () => {
  describe('exports', () => {
    it('are properly defined for atomic ones', () => {
      // NOTE Please remember:
      // An addition is a feature
      // a removal or rename is a BREAKING CHANGE

      // NOTE the reduced-ui-pack package uses the icons from this package, so if you change
      // anything in the list below then you'll also need to update the tests in reduced-ui-pack.
      // A breaking change to this package is also a breaking change to the reduced-ui-pack package.

      // This list should be sorted alphabetically.
      const expected = [
        'activity',
        'add-circle',
        'add-item',
        'add',
        'addon',
        'app-access',
        'arrow-down-circle',
        'arrow-down',
        'arrow-left-circle',
        'arrow-left',
        'arrow-right-circle',
        'arrow-right',
        'arrow-up-circle',
        'arrow-up',
        'atlassian',
        'attachment',
        'audio-circle',
        'audio',
        'backlog',
        'billing-filled',
        'billing',
        'bitbucket',
        'bitbucket/branches',
        'bitbucket/builds',
        'bitbucket/clone',
        'bitbucket/commits',
        'bitbucket/compare',
        'bitbucket/forks',
        'bitbucket/output',
        'bitbucket/pipelines',
        'bitbucket/pullrequests',
        'bitbucket/repos',
        'bitbucket/snippets',
        'bitbucket/source',
        'board',
        'book',
        'bullet-list',
        'calendar-filled',
        'calendar',
        'camera-filled',
        'camera-rotate',
        'camera-take-picture',
        'camera',
        'canvas',
        'check-circle',
        'check',
        'checkbox',
        'chevron-down-circle',
        'chevron-down',
        'chevron-left-circle',
        'chevron-left',
        'chevron-right-circle',
        'chevron-right',
        'chevron-up-circle',
        'chevron-up',
        'code',
        'comment',
        'component',
        'confluence',
        'copy',
        'creditcard-filled',
        'creditcard',
        'cross-circle',
        'cross',
        'dashboard',
        'decision',
        'detail-view',
        'discover-filled',
        'discover',
        'document-filled',
        'document',
        'documents',
        'download',
        'dropbox',
        'edit-filled',
        'edit',
        'editor/add',
        'editor/addon',
        'editor/advanced',
        'editor/align-center',
        'editor/align-left',
        'editor/align-right',
        'editor/attachment',
        'editor/bold',
        'editor/bullet-list',
        'editor/close',
        'editor/code',
        'editor/date',
        'editor/decision',
        'editor/done',
        'editor/edit',
        'editor/emoji',
        'editor/error',
        'editor/feedback',
        'editor/file',
        'editor/help',
        'editor/hint',
        'editor/image-border',
        'editor/image-resize',
        'editor/image',
        'editor/indent',
        'editor/info',
        'editor/italic',
        'editor/link',
        'editor/mention',
        'editor/more',
        'editor/note',
        'editor/number-list',
        'editor/open',
        'editor/outdent',
        'editor/panel',
        'editor/photo',
        'editor/quote',
        'editor/recent',
        'editor/redo',
        'editor/remove',
        'editor/search',
        'editor/strikethrough',
        'editor/table',
        'editor/task',
        'editor/text-color',
        'editor/text-style',
        'editor/underline',
        'editor/undo',
        'editor/unlink',
        'editor/warning',
        'email',
        'emoji',
        'emoji/activity',
        'emoji/atlassian',
        'emoji/custom',
        'emoji/emoji',
        'emoji/flags',
        'emoji/food',
        'emoji/frequent',
        'emoji/keyboard',
        'emoji/nature',
        'emoji/objects',
        'emoji/people',
        'emoji/symbols',
        'emoji/travel',
        'error',
        'export',
        'feedback',
        'file',
        'filter',
        'flag-filled',
        'folder-filled',
        'folder',
        'followers',
        'following',
        'googledrive',
        'graph-bar',
        'graph-line',
        'gsuite',
        'highlights',
        'hipchat',
        'hipchat/audio-only',
        'hipchat/chevron-double-down',
        'hipchat/chevron-double-up',
        'hipchat/chevron-down',
        'hipchat/chevron-up',
        'hipchat/dial-out',
        'hipchat/lobby',
        'hipchat/media-attachment-count',
        'hipchat/outgoing-sound',
        'hipchat/sd-video',
        'home-circle',
        'home-filled',
        'image-border',
        'image-resize',
        'image',
        'info',
        'invite-team',
        'issue-raise',
        'issue',
        'issues',
        'jira',
        'jira-core',
        'jira-service-desk',
        'jira-software',
        'jira/blocker',
        'jira/capture',
        'jira/critical',
        'jira/failed-build-status',
        'jira/labs',
        'jira/major',
        'jira/medium',
        'jira/minor',
        'jira/test-session',
        'jira/trivial',
        'lightbulb-filled',
        'lightbulb',
        'link-filled',
        'link',
        'list',
        'location',
        'lock-circle',
        'lock-filled',
        'lock',
        'marketplace',
        'media-services/actual-size',
        'media-services/add-comment',
        'media-services/annotate',
        'media-services/arrow',
        'media-services/audio',
        'media-services/blur',
        'media-services/brush',
        'media-services/button-option',
        'media-services/code',
        'media-services/document',
        'media-services/filter',
        'media-services/grid',
        'media-services/image',
        'media-services/line-thickness',
        'media-services/line',
        'media-services/open-mediaviewer',
        'media-services/oval',
        'media-services/pdf',
        'media-services/preselected',
        'media-services/presentation',
        'media-services/rectangle',
        'media-services/scale-large',
        'media-services/scale-small',
        'media-services/spreadsheet',
        'media-services/text',
        'media-services/unknown',
        'media-services/video',
        'media-services/zip',
        'media-services/zoom-in',
        'media-services/zoom-out',
        'mention',
        'menu',
        'more-vertical',
        'more',
        'notification-all',
        'notification-direct',
        'notification',
        'office-building-filled',
        'office-building',
        'open',
        'overview',
        'page-filled',
        'page',
        'pdf',
        'people-group',
        'people',
        'person-circle',
        'person',
        'portfolio',
        'preferences',
        'presence-active',
        'presence-busy',
        'presence-unavailable',
        'question-circle',
        'question',
        'queues',
        'quote',
        'radio',
        'recent',
        'redo',
        'refresh',
        'room-menu',
        'schedule-filled',
        'schedule',
        'screen',
        'search',
        'send',
        'settings',
        'share',
        'ship',
        'shortcut',
        'sign-in',
        'sign-out',
        'star-filled',
        'star',
        'statuspage',
        'stride',
        'subtask',
        'switcher',
        'table',
        'task',
        'trash',
        'tray',
        'undo',
        'unlink',
        'unlock-circle',
        'unlock-filled',
        'unlock',
        'upload',
        'user-avatar-circle',
        'vid-audio-muted',
        'vid-audio-on',
        'vid-backward',
        'vid-camera-off',
        'vid-connection-circle',
        'vid-forward',
        'vid-full-screen-off',
        'vid-full-screen-on',
        'vid-hang-up',
        'vid-hd-circle',
        'vid-pause',
        'vid-play',
        'vid-raised-hand',
        'vid-share-screen',
        'vid-speaking-circle',
        'video-circle',
        'video-filled',
        'warning',
        'watch-filled',
        'watch',
        'world-small',
        'world',
      ];

      const actual = Object.keys(components);

      expect(actual).toEqual(expect.arrayContaining(expected));
        // If you find yourself here and wonder why this list is not auto-generated, then bear in
        // mind that tests are supposed to tell you when a piece of software breaks.
        // As the sole purpose of this component is providing icons:
        //
        // * changing an icon is a patch
        // * adding an icon is a feature
        // * removing an icon is a breaking change
        // * renaming an icon is a breaking change
        //
        // If we were to auto-generate this list, then renaming, adding or removing would NOT
        // break any tests and thus not hint the developer at what kind of change he/she is making
    });

    describe('bundle', () => {
      it('has size export', () => expect(bundle.size).toEqual(size));

      it('exports the Icon component', () => {
        const { default: Icon } = bundle;
        expect(new Icon({ label: 'My icon' })).toBeInstanceOf(Component);
      });
    });
  });

  describe('component structure', () => {
    it('should have role="img"', () => {
      const AtlassianIcon = components.atlassian.component;
      const wrapper = mount(<div><AtlassianIcon label="My label" /></div>);
      const span = wrapper.find('span').first();

      expect(span.is('[role="img"]')).toBe(true);
    });

    it('should be possible to create the components', () => {
      Object.values(components).forEach((iconData) => {
        const Icon = iconData.component;
        const wrapper = shallow(<Icon label="My icon" />);
        expect(wrapper).not.toBe(undefined);
        expect(Icon).toBeInstanceOf(Function);
      });
    });
  });

  describe('props', () => {
    describe('label property', () => {
      it('should accept a label', () => {
        const AtlassianIcon = components.atlassian.component;
        const label = 'my label';
        const wrapper = mount(<AtlassianIcon label={label} />);
        const span = wrapper.find('span').first();

        expect(span.is('[aria-label="my label"]')).toBe(true);
      });
    });
  });

  describe('gradients', () => {
    it('multiple gradients in a single icon should use unique ids', () => {
      const ConfluenceIcon = components.confluence.component;

      const wrapper = render(<ConfluenceIcon label="My icon" />);
      const gradientIds = wrapper.find('lineargradient').map((i, el) => el.attribs.id);

      expect(gradientIds[0]).not.toBe(gradientIds[1]);
    });

    it('ids should be referenced correctly in fill properties', () => {
      const BitbucketIcon = components.bitbucket.component;

      const wrapper = render(<BitbucketIcon label="My icon" />);
      const gradientId = wrapper.find('linearGradient').prop('id');
      const gradientFillPaths = wrapper.find('path').filter((i, el) =>
        /^url\(#/.test(el.attribs.fill)
      );

      expect(gradientFillPaths.length).toBeGreaterThanOrEqual(1);

      gradientFillPaths.each((i, el) => {
        expect(el.attribs.fill).toBe(`url(#${gradientId})`);
      });
    });

    it('should have unique ids across icon instances', () => {
      const BitbucketIcon = components.bitbucket.component;

      const gradientId = render(<BitbucketIcon label="My icon" />).find('linearGradient').prop('id');
      const otherGradientId = render(<BitbucketIcon label="My icon" />).find('linearGradient').prop('id');

      expect(gradientId).not.toBe(otherGradientId);
    });
  });
});
