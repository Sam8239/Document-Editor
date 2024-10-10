import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export default Extension.create({
  name: 'customHighlight',

  addOptions() {
    return {
      highlightClass: 'highlight',
      highlightDuration: 300
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('customHighlight'),
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations = [];
            const { currentWordIndex, words } = this.editor.storage.customHighlight;

            if (currentWordIndex !== null && words.length > 0) {
              let wordIndex = 0;
              let totalOffset = 0;

              doc.descendants((node, pos) => {
                if (node.isText) {
                  const nodeWords = node.text.split(/\s+/);
                  let nodeOffset = 0;

                  nodeWords.forEach((word) => {
                    if (wordIndex === currentWordIndex) {
                      decorations.push(
                        Decoration.inline(pos + nodeOffset, pos + nodeOffset + word.length, {
                          class: this.options.highlightClass,
                        })
                      );
                    }
                    wordIndex++;
                    nodeOffset += word.length + 1;
                  });

                  totalOffset += node.text.length;
                }
              });
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },

  addStorage() {
    return {
      currentWordIndex: null,
      words: [],
      timeoutId: null,
    };
  },

  addCommands() {
    return {
      setWords: (words) => ({ editor }) => {
        editor.storage.customHighlight.words = words;
        return true;
      },
      setHighlightedWordIndex: (index) => ({ editor }) => {
        editor.storage.customHighlight.currentWordIndex = index;
        editor.view.dispatch(editor.state.tr);

        if (editor.storage.customHighlight.timeoutId) {
          clearTimeout(editor.storage.customHighlight.timeoutId);
        }

        editor.storage.customHighlight.timeoutId = setTimeout(() => {
          editor.commands.clearHighlightedWord();
        }, this.options.highlightDuration);

        return true;
      },
      clearHighlightedWord: () => ({ editor }) => {
        editor.storage.customHighlight.currentWordIndex = null;
        if (editor.storage.customHighlight.timeoutId) {
          clearTimeout(editor.storage.customHighlight.timeoutId);
          editor.storage.customHighlight.timeoutId = null;
        }
        editor.view.dispatch(editor.state.tr);
        return true;
      },
    };
  },
});