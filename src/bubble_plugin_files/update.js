function update(instance, properties, context) {
    // Alias for instance data
    const d = instance.data;

    // Destructure properties object
    const {
        placeholder,
        show_placeholder_once,
        initial_content,
        bubble_menu_id,
        link_popover_id,
        commands_container_id,
        comments_container_id,
        upload_url,
        read_only,
        auto_focus,
        character_limit,
        enable_collab,
        collab_app_id,
        collab_doc_id,
        collab_token,
        collab_username,
        line_height,
        h1_size,
        h1_weight,
        h2_size,
        h2_weight,
        h3_size,
        h3_weight,
        bubble: { font_size, font_color, font_face },
    } = properties;

    try {
        // Ensure the DocumentEditor class is defined
        if (typeof DocumentEditor === "undefined") {
            throw new Error("DocumentEditor class is not defined.");
        }

        // Trim initial content and upload URL
        d.initialContent = initial_content?.trim();
        d.uploadUrl = upload_url?.trim();

        // Get the bubble menu element by ID
        const bubbleMenuElements = {
            main: bubble_menu_id
                ? document.querySelector(`#${bubble_menu_id}`)
                : null,
            link: link_popover_id
                ? document.querySelector(`#${link_popover_id}`)
                : null,
        };

        let collabConfig;

        if (enable_collab) {
            collabConfig = {
                name: collab_doc_id ?? "",
                appId: collab_app_id ?? "",
                token: collab_token ?? "",
            };
        }

        // Set document editor options
        d.documentOptions = {
            placeholderText: placeholder,
            initialContent: d.initialContent,
            editable: !read_only, // Set editable based on read_only property
            autofocus: auto_focus,
            characterLimit: character_limit,
            createHandler: () => {
                console.log(
                    "%c DocumentEditor is ready!",
                    "background:#ffff10;padding:6px;border-radius:4px;font-weight:600;"
                );
                instance.publishState("document_ready", true);
                instance.triggerEvent("document_ready");
            },
            updateHandler: (editor) => {
                instance.triggerEvent("content_change");
            },
            selectionHandler: (selectedText) => {
                // Publish selected text state
                instance.publishState("selected_text", selectedText);
                instance.triggerEvent("selection_change");
            },
            imageUploadHandler: async (file) => {
                // Handle image upload
                try {
                    const data = await d.uploadFileToServer(file, d.uploadUrl);
                    return data;
                } catch (error) {
                    console.error(error);
                    context.reportDebugger(error);
                }
            },
            transactionHandler: (editor, tr) => {
                // Handle various editor transactions
                const action = tr.getMeta("action");
                if (action && action.type === "delete") {
                    instance.publishState("removed_image_src", action.src);
                    instance.triggerEvent("image_remove");
                }

                // Publish editor state changes
                instance.publishState("can_undo", editor.canUndo());
                instance.publishState("can_redo", editor.canRedo());
                instance.publishState(
                    "h1_active",
                    editor.isActive("heading", { level: 1 })
                );
                instance.publishState(
                    "h2_active",
                    editor.isActive("heading", { level: 2 })
                );
                instance.publishState(
                    "h3_active",
                    editor.isActive("heading", { level: 3 })
                );
                instance.publishState("bold_active", editor.isActive("bold"));
                instance.publishState(
                    "italic_active",
                    editor.isActive("italic")
                );
                instance.publishState(
                    "underline_active",
                    editor.isActive("underline")
                );
                instance.publishState(
                    "ordered_list_active",
                    editor.isActive("orderedList")
                );
                instance.publishState(
                    "bullet_list_active",
                    editor.isActive("bulletList")
                );
                instance.publishState(
                    "text_active",
                    editor.isActive("paragraph")
                );
                instance.publishState("read_only", !editor.isEditable());
                instance.publishState(
                    "first_sentence",
                    editor.extractFirstSentence()
                );
                instance.publishState("word_count", editor.wordCount);
                instance.publishState("character_count", editor.characterCount);
                instance.publishState("previous_url", editor.getPreviousURL());
                instance.publishState(
                    "content_json",
                    JSON.stringify(editor.getJSON())
                );
                instance.publishState("content_html", editor.getHTML());
                instance.publishState("content_text", editor.getText());
                instance.publishState(
                    "first_sentence",
                    editor.extractFirstSentence()
                );
            },
            focusHandler: (editor, event) => {
                // Publish state on editor focus
                instance.publishState("editor_focused", true);
                instance.triggerEvent("editor_focus");
            },
            blurHandler: (editor, event) => {
                // Publish state on editor blur
                instance.publishState("editor_focused", false);
                instance.triggerEvent("editor_blur");
            },
            onUploadStart: () => {
                // Publish state when upload starts
                instance.publishState("uploading", true);
                instance.triggerEvent("upload_start");
            },
            onUploadFinish: () => {
                // Publish state when upload finishes
                instance.publishState("uploading", false);
                instance.triggerEvent("upload_finish");
            },
            bubbleMenuElements,
            commentsContainerId: comments_container_id,
            slashCommandContainerId: commands_container_id,
            bubbleMenuShownHandler: () => {
                // updates the state to indicate that the bubble menu is visible
                instance.publishState("bubble_menu_visible", true);
                instance.triggerEvent("bubble_menu_shown");
            },
            bubbleMenuHiddenHandler: () => {
                // Updates the state to indicate that the bubble menu is not visible
                instance.publishState("bubble_menu_visible", false);
                instance.triggerEvent("bubble_menu_hidden");
            },
            linkModalShownHandler: (editor) => {
                // Updates the state to indicate that the link modal is  visible
                instance.publishState("link_modal_visible", true);
                instance.triggerEvent("link_modal_shown");
                instance.publishState("previous_url", editor.getPreviousURL());
            },
            linkModalHiddenHandler: () => {
                // Updates the state to indicate that the link modal is not visible
                instance.publishState("link_modal_visible", false);
                instance.triggerEvent("link_modal_hidden");
                instance.publishState("previous_url", "");
            },
            slashCommandContainerShown: () => {
                instance.publishState("commands_container_visible", true);
                instance.triggerEvent("commands_container_shown");
            },
            slashCommandContainerHidden: () => {
                instance.publishState("commands_container_visible", false);
                instance.triggerEvent("commands_container_hidden");
            },
            documentSyncedCallback: (state) => {
                instance.triggerEvent("document_synced");
                instance.publishState("synced", state);
            },
            onStreamEnd: () => {
                instance.triggerEvent("stream_end");
            },
            currentUser: collab_username ?? "",
            collabConfig,
        };

        // Initialize the DocumentEditor if it is not already initialized
        if (d.documentEditor === null) {
            d.element = instance.canvas[0];
            d.documentEditor = new DocumentEditor(d.element, {
                ...d.documentOptions,
            });
        }

        // Set initial content if provided
        if (
            d.documentEditor !== null &&
            !d.documentEditor.isTCollabActive &&
            d.prevInitialContent !== initial_content
        ) {
            d.documentEditor.setContent(initial_content);
            d.prevInitialContent = initial_content;
        }

        // Update the stylesheet with dynamic styles
        if (d.stylesheet) {
            d.stylesheet.id = d.documentEditor.ID;
            d.stylesheet.innerHTML = d.minifyHTML(`
            #${d.documentEditor.ID}.document-editor.ProseMirror {
                outline: none;
                line-height: ${line_height};
                letter-spacing: -0.25px;
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror a {
                color: #2a74e3;
                text-decoration: underline;
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror h1 {
                font-size: ${h1_size}px;
                font-weight: ${h1_weight};
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror h2 {
                font-size: ${h2_size}px;
                font-weight: ${h2_weight};
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror h3 {
                font-size: ${h3_size}px;
                font-weight: ${h3_weight};
            }

            #${
                d.documentEditor.ID
            }.document-editor .image-placeholder .image-placeholder__resize-handle {
                display: none;
            }

            #${
                d.documentEditor.ID
            }.document-editor .image-placeholder:hover .image-placeholder__resize-handle {
                display: initial;
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror img {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror pre {
                background: rgba(242, 243, 244);
                color: #fff;
                font-family: "JetBrainsMono", monospace;
                padding: 0.75rem 1rem;
                border-radius: 0.5rem;
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror pre code {
                box-decoration-break: clone;
                color: #198038;
                font-size: 0.9rem;
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror code {
                background-color: rgba(242, 243, 244, 0.1);
                border-radius: 0.25em;
                box-decoration-break: clone;
                color: #198038;
                font-size: 0.9rem;
                padding: 0.25em;
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror blockquote {
                padding-left: 1rem;
                border-left: 4px solid rgba(13, 13, 13, 0.1);
                margin: 1.5rem 0;
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror iframe {
                border: 8px solid #000;
                border-radius: 4px;
                min-width: 200px;
                max-width: 100%;
                min-height: 200px;
                height: auto;
                display: block;
                outline: 0px solid transparent;
            }

            #${
                d.documentEditor.ID
            }.document-editor.ProseMirror div[data-youtube-video] {
                cursor: move;
                padding-right: 24px;
            }

            .ProseMirror-selectednode iframe {
                transition: outline 0.15s;
                outline: 6px solid #ece111;
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror mark.highlight {
                background: #d7ac33;
            }

            #${d.documentEditor.ID}.document-editor.ProseMirror .has-comment {
                background: #fff9c9;
                border-bottom: 2px solid #d6c85c;
            }

            .document-comment.active {
                box-shadow: 0px 4px 20px -8px rgba(97, 80, 68, 0.18);
            }


            .document-editor.ProseMirror [data-type="animated"]:last-of-type {
                position: relative;
                display: inline-block;
            }

            .document-editor.ProseMirror [data-type="animated"]:last-of-type::after {
                content: "•";
                color: #ede7e7;
                font-size: 2rem;
                position: absolute;
                top: 10px;
                transform: translateY(-50%);
                right: -18px;
            }

            @keyframes fadeIn {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }

            .document-editor.ProseMirror .fade-in {
                animation: fadeIn 2s ease-in-out;
            }

            .collaboration-cursor__caret {
                border-left: 1px solid #0d0d0d;
                border-right: 1px solid #0d0d0d;
                margin-left: -1px;
                margin-right: -1px;
                pointer-events: none;
                position: relative;
                word-break: normal;
            }

            .collaboration-cursor__label {
                border-radius: 3px 3px 3px 0;
                color: #0d0d0d;
                font-size: 12px;
                font-style: normal;
                font-weight: 600;
                left: -1px;
                line-height: normal;
                padding: 0.1rem 0.3rem;
                position: absolute;
                top: -1.4em;
                user-select: none;
                white-space: nowrap;
            }

            ${placeholderStyle(d.documentEditor.ID)}
            `);
        }
    } catch (error) {
        // Handle errors
        console.error(error);
        context.reportDebugger(error);
    }

    // Helper functions
    function placeholderStyle(docId) {
        if (show_placeholder_once) {
            return `
            #${docId}.document-editor.ProseMirror p.is-editor-empty:first-child::before {
                color: #c2bdba;
                content: attr(data-placeholder);
                float: left;
                height: 0;
                pointer-events: none;
            }
            `;
        }
        return `
        #${docId}.document-editor.ProseMirror p.is-empty::before {
            color: #c2bdba;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
        }
        `;
    }
}
