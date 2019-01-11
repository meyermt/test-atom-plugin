'use babel';

import TestAtomPluginView from './test-atom-plugin-view';
import { CompositeDisposable } from 'atom';

export default {

  testAtomPluginView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.testAtomPluginView = new TestAtomPluginView(state.testAtomPluginViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.testAtomPluginView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'test-atom-plugin:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.testAtomPluginView.destroy();
  },

  serialize() {
    return {
      testAtomPluginViewState: this.testAtomPluginView.serialize()
    };
  },

  toggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let reversed = selection.split('').reverse().join('')
      editor.insertText(reversed)
    }
  }

};
