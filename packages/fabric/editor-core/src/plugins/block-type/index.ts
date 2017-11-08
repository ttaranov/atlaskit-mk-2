import { Node, Schema } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import {
  NORMAL_TEXT, HEADING_1, HEADING_2, HEADING_3, HEADING_4, HEADING_5,
  BLOCK_QUOTE, CODE_BLOCK, PANEL, OTHER, BlockType
} from './types';

import * as commands from '../../commands';
import keymapHandler from './keymap';
import inputRulePlugin from './input-rule';

import { areBlockTypesDisabled } from '../../utils';

export type StateChangeHandler = (state: BlockTypeState) => any;
export type BlockTypeStateSubscriber = (state: BlockTypeState) => any;

/**
 *
 * Plugin State
 *
 */
export class BlockTypeState {
  private changeHandlers: StateChangeHandler[] = [];
  private state: EditorState;

  // public state
  currentBlockType: BlockType = NORMAL_TEXT;
  blockTypesDisabled: boolean = false;
  availableBlockTypes: BlockType[] = [];
  availableWrapperBlockTypes: BlockType[] = [];
  isCodeBlock: boolean = false;

  constructor(state: EditorState) {
    this.changeHandlers = [];
    this.state = state;

    this.availableBlockTypes = [NORMAL_TEXT, HEADING_1, HEADING_2, HEADING_3, HEADING_4, HEADING_5]
      .filter(this.isBlockTypeSchemaSupported);

    this.availableWrapperBlockTypes = [BLOCK_QUOTE, CODE_BLOCK, PANEL].filter(this.isBlockTypeSchemaSupported);

    this.update(state);
  }

  subscribe(cb: StateChangeHandler) {
    this.changeHandlers.push(cb);
    cb(this);
  }

  unsubscribe(cb: StateChangeHandler) {
    this.changeHandlers = this.changeHandlers.filter(ch => ch !== cb);
  }

  toggleBlockType(name: string, view: EditorView): boolean {
    return commands.toggleBlockType(view, name);
  }

  insertBlockType(name: string, view: EditorView): boolean {
    return commands.insertBlockType(view, name);
  }

  update(newEditorState, dirty = false) {
    this.state = newEditorState;

    const newBlockType = this.detectBlockType();
    if (newBlockType !== this.currentBlockType) {
      this.currentBlockType = newBlockType;
      dirty = true;
    }

    const newBlockTypesDisabled = areBlockTypesDisabled(this.state);
    if (newBlockTypesDisabled !== this.blockTypesDisabled) {
      this.blockTypesDisabled = newBlockTypesDisabled;
      dirty = true;
    }

    if (dirty) {
      this.triggerOnChange();
    }
  }

  private triggerOnChange() {
    this.changeHandlers.forEach(cb => cb(this));
  }

  private detectBlockType(): BlockType {
    const { state } = this;
    // Before a document is loaded, there is no selection.
    if (!state.selection) {
      return NORMAL_TEXT;
    }
    let blockType;
    const { $from, $to } = state.selection;
    state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      const nodeBlockType = this.availableBlockTypes.filter(blockType => blockType === this.nodeBlockType(node));
      if (nodeBlockType.length > 0) {
        if (!blockType) {
          blockType = nodeBlockType[0];
        } else if (blockType !== OTHER && blockType !== nodeBlockType[0]) {
          blockType = OTHER;
        }
      }
    });
    return blockType || OTHER;
  }

  private nodeBlockType = (node: Node): BlockType => {
    if (node.type === this.state.schema.nodes.heading) {
      switch (node.attrs['level']) {
        case 1:
          return HEADING_1;
        case 2:
          return HEADING_2;
        case 3:
          return HEADING_3;
        case 4:
          return HEADING_4;
        case 5:
          return HEADING_5;
      }
    } else if (node.type === this.state.schema.nodes.paragraph) {
      return NORMAL_TEXT;
    }
    return OTHER;
  }

  private isBlockTypeSchemaSupported = (blockType: BlockType) => {
    const { state } = this;
    switch (blockType) {
      case NORMAL_TEXT:
        return !!state.schema.nodes.paragraph;
      case HEADING_1:
      case HEADING_2:
      case HEADING_3:
      case HEADING_4:
      case HEADING_5:
        return !!state.schema.nodes.heading;
      case BLOCK_QUOTE:
        return !!state.schema.nodes.blockquote;
      case CODE_BLOCK:
        return !!state.schema.nodes.codeBlock;
      case PANEL:
        return !!state.schema.nodes.panel;
    }
  }
}

export const stateKey = new PluginKey('blockTypePlugin');

export const plugin = new Plugin({
  state: {
    init(config, state: EditorState) {
      return new BlockTypeState(state);
    },
    apply(tr, pluginState: BlockTypeState, oldState, newState) {
      pluginState.update(newState);
      return pluginState;
    }
  },
  key: stateKey,
  view: (view: EditorView) => {

    const pluginState = stateKey.getState(view.state);
    pluginState.keymapHandler = keymapHandler(view, pluginState);
    return {};
  },
  props: {
    handleKeyDown(view, event) {
      return stateKey.getState(view.state).keymapHandler(view, event);
    }
  }
});

const plugins = (schema: Schema) => {
  return [plugin, inputRulePlugin(schema)].filter((plugin) => !!plugin) as Plugin[];
};

export default plugins;
