import * as React from 'react';
import {PureComponent} from 'react';

import {
    default as MediaItem,
    Props as MediaItemProps
} from './MediaItem';
import {MediaStateManager} from '@atlaskit/media-core';
import {MediaPluginState, stateKey as mediaStateKey} from '../../plugins/media';

import { EditorView } from 'prosemirror-view';

export interface Props extends MediaItemProps {
    editorView?: EditorView;
}

export default class Media extends PureComponent<Props, {}> {
    render() {
        // Pass in the fallback state manager from the editor plugin
        const stateManagerFallback = this.getStateManagerFromEditorPlugin();
        const props = {
            stateManagerFallback,
            ...this.props as MediaItemProps
        };

        return (
            <MediaItem {...props} />
        );
    }

    /**
     * Get the state manager from the editor plugin to feed to MediaItem as a prop
     * @returns {MediaStateManager|undefined}
     */
    getStateManagerFromEditorPlugin(): MediaStateManager | undefined {
        const {editorView} = this.props;
        if (!editorView) {
            return;
        }

        const pluginState = mediaStateKey.getState(editorView.state) as MediaPluginState;

        if (!pluginState) {
            return;
        }

        return pluginState.stateManager;
    }
}
