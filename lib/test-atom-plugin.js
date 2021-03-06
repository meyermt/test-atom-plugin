'use babel';

import TestAtomPluginView from './test-atom-plugin-view';
import { CompositeDisposable } from 'atom';
import request from 'request';

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
      'test-atom-plugin:fetch': () => this.fetch()
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

  fetch() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      this.download(selection).then((html) => {
        editor.insertText(html)
      }).catch((error) => {
        atom.notifications.addWarning(error.reason)
      })
    }
  },

  download(url) {
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve(body)
        } else {
          reject({
            reason: 'Unable to download page'
          })
        }
      })
    })
  }

};
