import { Mark } from "@tiptap/core";

export default Mark.create({
    name: "customMarkHighlight",
    addOptions() {
        return {
            ...this.parent?.(),
            multicolor: false,
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        if (!this.options.multicolor) {
            return {};
        }

        return {
            color: {
                default: null,
                parseHTML: (element) =>
                    element.getAttribute("data-color") ||
                    element.style.backgroundColor,
                renderHTML: (attributes) => {
                    if (!attributes.color) {
                        return {};
                    }

                    return {
                        "data-color": attributes.color,
                        style: `background-color: ${attributes.color}; color: inherit`,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "mark.highlight",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "mark",
            {
                ...HTMLAttributes,
                class: "highlight",
            },
            0,
        ];
    },
});
