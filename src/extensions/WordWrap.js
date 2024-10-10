import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export default Extension.create({
  name: 'wordWrap',

  addOptions() {
    return {
      wordTimings: { start_times: [] },
      sound: null,
    };
  },

  addProseMirrorPlugins() {

    const wordWrapPlugin = new Plugin({
      key: new PluginKey('wordWrap'),
      props: {
        decorations: (state) => {
          const { doc } = state;
          const decorations = [];

          let wordIndex = 0;
          doc.nodesBetween(0, doc.content.size, (node, pos) => {
            if (node.isText) {
              const words = node.text.split(/\s+/);
              let lastIndex = 0;
              
              words.forEach((word) => {
                if (word.length > 0) {
                  const from = pos + node.text.indexOf(word, lastIndex);
                  const to = from + word.length;
                  const duration = this.options.wordTimings.start_times[wordIndex];

                  decorations.push(
                    Decoration.inline(from, to, {
                      class: 'word',
                      style: 'cursor: pointer;',
                      'data-play-time': duration,
                      'data-word-index': wordIndex,
                    })
                  );

                  lastIndex = node.text.indexOf(word, lastIndex) + word.length;
                  wordIndex++;
                }
              });
            }
          });

          return DecorationSet.create(doc, decorations);
        },
      },
    });

    return [wordWrapPlugin];
  },
});