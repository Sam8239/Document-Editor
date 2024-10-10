import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import renderSlashCommand from "./slash_command/renderSlashCommand";

export default Extension.create({
    name: "slash-command",

    addOptions() {
        return {
            ...this.parent?.(),
            slashCommandContainerId: "",
            suggestion: {
                char: "/",
                startOfLine: false,
                items: ({ query }) => {
                    return [
                        {
                            title: "Generate Content",
                            command: ({ editor, range }) => {
                                // console.log("Generate content executed!");
                                // TODO: Give AI a prompt, and insert the AI-generated content
                            },
                        },
                        {
                            title: "Continue Writing",
                            command: ({ editor, range }) => {
                                // console.log("Continue writing executed!");
                                // TODO: Give AI a prompt and existing content to continue writing, then insert the AI-generated content
                            },
                        },
                    ].filter((item) =>
                        item.title.toLowerCase().includes(query.toLowerCase())
                    );
                },
                command: ({ editor, range, props }) => {
                    // Execute the selected command
                    props.command({ editor, range, props });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        const {
            options: {
                slashCommandContainerId,
                slashCommandContainerHidden,
                slashCommandContainerShown,
                onCommandTrigger,
                suggestion,
            },
        } = this;

        return [
            Suggestion({
                editor: this.editor,
                ...suggestion,
                render: () => {
                    const container = document.querySelector(
                        `#${slashCommandContainerId}`
                    );

                    if (container) {
                        return renderSlashCommand(
                            container,
                            slashCommandContainerShown,
                            slashCommandContainerHidden,
                            (item, props) => {
                                // Execute the command when a button is clicked
                                // props.command(item);
                                if (typeof onCommandTrigger === "function") {
                                    onCommandTrigger(item, props);
                                }
                            }
                        );
                    }

                    return {};
                },
            }),
        ];
    },
});
