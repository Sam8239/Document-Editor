import { Node } from "@tiptap/core";

export default Node.create({
    name: "customText",

    group: "block",

    content: "inline*",

    selectable: false,

    parseHTML() {
        return [
            {
                tag: 'span[data-type="custom-text"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["span", { "data-type": "custom-text", ...HTMLAttributes }, 0];
    },
});
