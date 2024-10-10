import { Node } from "@tiptap/core";

export default Node.create({
    name: "animated",

    group: "block",

    content: "inline*",

    parseHTML() {
        return [
            {
                tag: 'span[data-type="animated"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "span",
            {
                ...HTMLAttributes,
                "data-type": "animated",
                class: "fade-in",
            },
            0,
        ];
    },

    // Create the custom NodeView
    addNodeView() {
        return ({ node, getPos }) => {
            // Create a span element
            const dom = document.createElement("span");
            dom.classList.add("fade-in");
            dom.setAttribute("data-type", "animated");
            dom.setAttribute("contenteditable", "false"); // Prevent editing

            // Add content from the node
            dom.textContent = node.textContent;

            return {
                dom,
                // Block all user interactions inside the node
                ignoreMutation() {
                    return true; // Prevent any ProseMirror mutation
                },
                selectNode() {
                    dom.classList.add("ProseMirror-selectednode");
                },
                deselectNode() {
                    dom.classList.remove("ProseMirror-selectednode");
                },
            };
        };
    },
});
